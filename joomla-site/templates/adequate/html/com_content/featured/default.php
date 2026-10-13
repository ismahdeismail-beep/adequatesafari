<?php
/**
 * @package     Adequate Safaris
 * @subpackage  tpl_adequate
 * Featured / category blog override — safari & accommodation listings.
 * @var  \Joomla\Component\Content\Site\View\Featured\HtmlView  $this
 */

defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Router\Route;
use Joomla\CMS\Uri\Uri;
use Joomla\Component\Content\Site\Helper\RouteHelper as ContentHelperRoute;

$app    = Factory::getApplication();
$params = $app->getTemplate(true)->params;
$bookingUrl = $params->get('bookingAppUrl', 'https://book.adequatesafaris.com');

$items = $this->items ?? [];

// ── Destination photo fallback ──────────────────────────────────
// If an article carries no intro/fulltext image yet, we still render a real
// photo from templates/adequate/images/cards/ by mapping the article alias
// (and category) to one of the bundled CC destination photos.
if (!function_exists('adqCardSlug')) {
    function adqCardSlug(string $alias, string $category = ''): string
    {
        $map = [
            'masai-mara'  => 'masai-mara-lion',
            'migration'   => 'maasai-mara-wildebeest',
            'wildebeest'  => 'maasai-mara-wildebeest',
            'mara'        => 'masai-mara-lion',
            'nakuru'      => 'lake-nakuru-flamingos',
            'amboseli'    => 'amboseli-kilimanjaro',
            'samburu'     => 'samburu-gerenuk',
            'aberdare'    => 'aberdare-range',
            'bogoria'     => 'rift-valley-bogoria',
            'rift-valley' => 'rift-valley-bogoria',
            'ngorongoro'  => 'tanzania-ngorongoro',
            'serengeti'   => 'tanzania-ngorongoro',
            'tanzania'    => 'tanzania-ngorongoro',
            'zanzibar'    => 'zanzibar-beach',
            'mount-kenya' => 'mount-kenya',
        ];
        $hay = mb_strtolower(trim($alias) . ' ' . trim($category));
        foreach ($map as $needle => $slug) {
            if (str_contains($hay, $needle)) {
                return $slug;
            }
        }

        return str_contains($hay, 'accom') ? 'accommodation-lodge' : 'masai-mara-lion';
    }
}
?>
<div class="adq-listing">
    <?php if (!empty($this->category->title) && $this->params->get('show_page_heading')) : ?>
        <h1 class="adq-listing__title"><?php echo htmlspecialchars($this->escape($this->params->get('page_heading', $this->category->title)), ENT_QUOTES, 'UTF-8'); ?></h1>
    <?php endif; ?>

    <?php if (!empty($this->category->description)) : ?>
        <div class="adq-listing__intro"><?php echo HTMLHelper::_('content.prepare', $this->category->description, '', 'com_content.category'); ?></div>
    <?php endif; ?>

    <?php if (empty($items)) : ?>
        <p class="adq-empty"><?php echo Text::_('TPL_ADEQUATE_NO_SAFARIS'); ?></p>
    <?php else : ?>
    <div class="adq-grid">
        <?php foreach ($items as $item) :
            $images  = json_decode($item->images ?? '{}', true) ?: [];
            $thumb   = $images['image_intro'] ?? $images['image_fulltext'] ?? null;
            $intro   = strip_tags($item->introtext ?? '');
            ?>
            <article class="adq-card adq-card--safari" itemscope itemtype="https://schema.org/Product">
                <a class="adq-card__media" href="<?php echo Route::_(ContentHelperRoute::getArticleRoute($item->slug, $item->catid, $item->language)); ?>">
                    <?php if ($thumb) : ?>
                        <img src="<?php echo htmlspecialchars(Uri::root() . ltrim($thumb, '/'), ENT_QUOTES, 'UTF-8'); ?>"
                             alt="<?php echo htmlspecialchars($item->title, ENT_QUOTES, 'UTF-8'); ?>" loading="lazy" decoding="async" />
                    <?php else :
                        $cardSlug = adqCardSlug($item->alias ?? '', $this->category->title ?? '');
                        $cardBase = Uri::root() . 'templates/adequate/images/cards/' . $cardSlug; ?>
                        <picture>
                            <source type="image/webp"
                                    srcset="<?php echo $cardBase; ?>-400.webp 400w, <?php echo $cardBase; ?>-800.webp 800w"
                                    sizes="(min-width: 992px) 33vw, (min-width: 640px) 50vw, 100vw" />
                            <img src="<?php echo $cardBase; ?>-800.jpg"
                                 srcset="<?php echo $cardBase; ?>-400.jpg 400w, <?php echo $cardBase; ?>-800.jpg 800w"
                                 sizes="(min-width: 992px) 33vw, (min-width: 640px) 50vw, 100vw"
                                 alt="<?php echo htmlspecialchars($item->title, ENT_QUOTES, 'UTF-8'); ?>"
                                 loading="lazy" decoding="async" />
                        </picture>
                    <?php endif; ?>
                </a>
                <div class="adq-card__body">
                    <h2 class="adq-card__title">
                        <a href="<?php echo Route::_(ContentHelperRoute::getArticleRoute($item->slug, $item->catid, $item->language)); ?>" itemprop="url">
                            <span itemprop="name"><?php echo htmlspecialchars($item->title, ENT_QUOTES, 'UTF-8'); ?></span>
                        </a>
                    </h2>
                    <p class="adq-card__excerpt" itemprop="description">
                        <?php echo htmlspecialchars(\Joomla\String\StringHelper::substr($intro, 0, 130), ENT_QUOTES, 'UTF-8'); ?><?php echo \Joomla\String\StringHelper::strlen($intro) > 130 ? '…' : ''; ?>
                    </p>
                    <div class="adq-card__footer">
                        <a class="adq-btn adq-btn--primary adq-btn--sm"
                           data-adq-book data-safariId="<?php echo (int) $item->id; ?>"
                           href="<?php echo htmlspecialchars($bookingUrl, ENT_QUOTES, 'UTF-8'); ?>">
                            <?php echo Text::_('TPL_ADEQUATE_BOOK_NOW'); ?>
                        </a>
                        <a class="adq-btn adq-btn--ghost adq-btn--sm"
                           href="<?php echo Route::_(ContentHelperRoute::getArticleRoute($item->slug, $item->catid, $item->language)); ?>">
                            <?php echo Text::_('TPL_ADEQUATE_VIEW_DETAILS'); ?>
                        </a>
                    </div>
                </div>
            </article>
        <?php endforeach; ?>
    </div>

    <?php if (!empty($this->pagination) && $this->params->get('show_pagination')) : ?>
        <nav class="adq-pagination" aria-label="<?php echo Text::_('TPL_ADEQUATE_PAGINATION'); ?>">
            <?php echo $this->pagination->getPagesLinks(); ?>
        </nav>
    <?php endif; ?>
    <?php endif; ?>
</div>