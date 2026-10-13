<?php
/**
 * @package     Adequate Safaris
 * @subpackage  plg_content_api_sync
 *
 * Pushes Joomla content mutations (articles, categories, custom fields) to the
 * shared API so the safaris catalogue stays in sync. Failures are queued to
 * the `#__adq_sync_queue` table and retried by a scheduled CLI task.
 */

defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\Plugin\CMSPlugin;
use Joomla\CMS\Table\Table;
use Joomla\Database\ParameterType;
use Joomla\Event\SubscriberInterface;

final class PlgContentApiSync extends CMSPlugin implements SubscriberInterface
{
    protected $autoloadLanguage = true;

    public static function getSubscribedEvents(): array
    {
        return [
            'onContentAfterSave'    => 'onContentAfterSave',
            'onContentAfterDelete'  => 'onContentAfterDelete',
            'onCategoryAfterSave'   => 'onCategoryAfterSave',
            'onCategoryAfterDelete' => 'onCategoryAfterDelete',
        ];
    }

    private function watchedCategories(): array
    {
        $raw = (string) $this->params->get('sync_categories', '');
        $ids = array_filter(array_map('intval', preg_split('/[\s,]+/', $raw)));
        return $ids ?: [17, 14, 236, 237, 238, 240, 242, 243, 244];
    }

    private function isWatched(int $catid): bool
    {
        return in_array($catid, $this->watchedCategories(), true);
    }

    /**
     * @param  string   $context
     * @param  object   $article
     * @param  bool     $isNew
     * @return void
     */
    public function onContentAfterSave(string $context, object $article, bool $isNew): void
    {
        if ($context !== 'com_content.article') {
            return;
        }
        if (!$this->params->get('sync_on_save', 1)) {
            return;
        }
        if (!$this->isWatched((int) ($article->catid ?? 0))) {
            return;
        }

        $this->push('article', $isNew ? 'created' : 'updated', (int) $article->id, [
            'id'        => (int) $article->id,
            'title'     => $article->title ?? '',
            'alias'     => $article->alias ?? '',
            'catid'     => (int) ($article->catid ?? 0),
            'state'     => (int) ($article->state ?? 0),
            'language'  => $article->language ?? '*',
            'introtext' => $article->introtext ?? '',
            'fulltext'  => $article->fulltext ?? '',
            'images'    => $article->images ?? '{}',
            'metadesc'  => $article->metadesc ?? '',
            'metakey'   => $article->metakey ?? '',
        ]);
    }

    public function onContentAfterDelete(string $context, object $article): void
    {
        if ($context !== 'com_content.article') {
            return;
        }
        if (!$this->params->get('sync_on_delete', 1)) {
            return;
        }
        if (!$this->isWatched((int) ($article->catid ?? 0))) {
            return;
        }
        $this->push('article', 'deleted', (int) $article->id, ['id' => (int) $article->id]);
    }

    public function onCategoryAfterSave(string $context, object $table, bool $isNew): void
    {
        if ($context !== 'com_categories.category') {
            return;
        }
        if (!$this->isWatched((int) ($table->id ?? 0))) {
            return;
        }
        $this->push('category', $isNew ? 'created' : 'updated', (int) $table->id, [
            'id'          => (int) $table->id,
            'parent_id'   => (int) ($table->parent_id ?? 0),
            'title'       => $table->title ?? '',
            'alias'       => $table->alias ?? '',
            'description' => $table->description ?? '',
            'language'    => $table->language ?? '*',
        ]);
    }

    public function onCategoryAfterDelete(string $context, object $table): void
    {
        if ($context !== 'com_categories.category') {
            return;
        }
        $this->push('category', 'deleted', (int) $table->id, ['id' => (int) $table->id]);
    }

    /**
     * Send a change to the API. On failure, enqueue for retry.
     */
    private function push(string $entity, string $action, int $id, array $payload): void
    {
        $url   = (string) $this->params->get('api_url', '');
        $token = (string) $this->params->get('api_token', '');
        if ($url === '') {
            return;
        }

        $body = json_encode([
            'entity'  => $entity,
            'action'  => $action,
            'id'      => $id,
            'payload' => $payload,
            'sent_at' => (new \DateTimeImmutable())->format(DATE_ATOM),
        ], JSON_UNESCAPED_SLASHES);

        $ok = $this->post($url, $body, $token, (int) $this->params->get('timeout', 5));

        if (!$ok && $this->params->get('queue_on_failure', 1)) {
            $this->enqueue($entity, $action, $id, $payload);
        }
    }

    private function post(string $url, string $body, string $token, int $timeout): bool
    {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => $body,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => $timeout,
            CURLOPT_HTTPHEADER     => [
                'Content-Type: application/json',
                'Accept: application/json',
                'X-API-Key: ' . $token,
            ],
        ]);
        curl_exec($ch);
        $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $err  = curl_error($ch);
        curl_close($ch);

        if ($err !== '') {
            $this->log('Sync POST failed: ' . $err, 'warning');
            return false;
        }
        return $code >= 200 && $code < 300;
    }

    private function enqueue(string $entity, string $action, int $id, array $payload): void
    {
        try {
            $db = Factory::getContainer()->get('DatabaseDriver');
            $this->ensureQueueTable($db);

            $query = $db->getQuery(true)
                ->insert($db->quoteName('#__adq_sync_queue'))
                ->columns($db->quoteName(['entity', 'action', 'entity_id', 'payload', 'attempts', 'created_at']))
                ->values(':entity, :action, :id, :payload, 0, :now')
                ->bind(':entity', $entity)
                ->bind(':action', $action)
                ->bind(':id', $id, ParameterType::INTEGER)
                ->bind(':payload', json_encode($payload, JSON_UNESCAPED_SLASHES))
                ->bind(':now', Factory::getDate()->toSql());

            $db->setQuery($query)->execute();
        } catch (\Throwable $e) {
            $this->log('Failed to enqueue sync: ' . $e->getMessage(), 'error');
        }
    }

    private function ensureQueueTable($db): void
    {
        $db->setQuery(
            'CREATE TABLE IF NOT EXISTS ' . $db->quoteName('#__adq_sync_queue') . ' ('
            . 'id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,'
            . 'entity VARCHAR(32) NOT NULL,'
            . 'action VARCHAR(16) NOT NULL,'
            . 'entity_id INT NOT NULL,'
            . 'payload MEDIUMTEXT NULL,'
            . 'attempts INT NOT NULL DEFAULT 0,'
            . 'last_error TEXT NULL,'
            . 'created_at DATETIME NOT NULL,'
            . 'processed_at DATETIME NULL,'
            . 'PRIMARY KEY (id),'
            . 'KEY idx_status (processed_at, attempts)'
            . ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4'
        )->execute();
    }

    private function log(string $message, string $type = 'info'): void
    {
        try {
            Factory::getApplication()->getLogger()->{$type}($message, ['category' => 'plg_content_api_sync']);
        } catch (\Throwable $e) { /* logging is best-effort */ }
    }
}