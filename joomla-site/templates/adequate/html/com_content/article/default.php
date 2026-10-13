<?php
/**
 * @package     Adequate Safaris
 * @subpackage  tpl_adequate
 * Article override — renders a Safari / Accommodation detail page.
 * @var  \Joomla\Component\Content\Site\View\Article\HtmlView  $this
 */

defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Layout\LayoutHelper;
use Joomla\CMS\Router\Route;
use Joomla\CMS\Uri\Uri;

$app    = Factory::getApplication();
$params = $app->getTemplate(true)->params;
$item   = $this->item;
$slug   = $item->slug ?? ($item->id . ':' . $item->alias);

// ── Safari custom fields (Joomla com_fields) ────────────────────
$fields = [];
try {
    if (method_exists($this, 'getFields')) {
        foreach ((array) $this->getFields() as $field) {
            $fields[$field->name] = $field->value ?? null;
        }
    }
} catch (\Throwable $e) { /* fields optional */ }

$durationDays   = $fields['duration_days'] ?? null;
$durationNights = $fields['duration_nights'] ?? null;
$basePriceUsd   = $fields['base_price_usd'] ?? null;
$safariType     = $fields['safari_type'] ?? null;
$tier           = $fields['accommodation_tier'] ?? null;
$mealPlan       = $fields['meal_plan'] ?? null;
$highlights     = $fields['highlights'] ?? null;
$includes       = $fields['includes'] ?? null;
$excludes       = $fields['excludes'] ?? null;

if (is_string($highlights)) { $highlights = array_filter(array_map('trim', explode("\n", $highlights))); }
if (is_string($includes))   { $includes   = array_filter(array_map('trim', explode("\n", $includes))); }
if (is_string($excludes))   { $excludes   = array_filter(array_map('trim', explode("\n", $excludes))); }

$images  = json_decode($item->images ?? '{}', true) ?: [];
$heroImg = $images['image_intro'] ?? $images['image_fulltext'] ?? null;

// Theme fallback — if the article has no image yet, map its alias to one of
// the bundled CC destination photos (kept in sync with featured/default.php).
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
if (!$heroImg) {
    $heroCard = adqCardSlug($item->alias ?? '', $item->category_title ?? '');
    $heroImg  = 'templates/adequate/images/cards/' . $heroCard . '-1280.jpg';
}

$bookingUrl   = $params->get('bookingAppUrl', 'https://book.adequatesafaris.com');
$itineraryUrl = $params->get('itineraryAppUrl', 'https://plan.adequatesafaris.com');
?>
<article class="adq-safari" itemscope itemtype="https://schema.org/Product">

    <header class="adq-safari__hero<?php echo $heroImg ? ' has-image' : ''; ?>"
            <?php if ($heroImg) : ?>style="background-image:url('<?php echo htmlspecialchars(Uri::root() . ltrim($heroImg, '/'), ENT_QUOTES, 'UTF-8'); ?>')"<?php endif; ?>>
        <div class="container adq-safari__hero-inner">
            <h1 class="adq-safari__title" itemprop="name"><?php echo htmlspecialchars($item->title, ENT_QUOTES, 'UTF-8'); ?></h1>

            <ul class="adq-safari__meta">
                <?php if ($safariType) : ?>
                <li class="adq-safari__meta-item"><?php echo htmlspecialchars(ucfirst((string) $safariType), ENT_QUOTES, 'UTF-8'); ?></li>
                <?php endif; ?>
                <?php if ($durationDays) : ?>
                <li class="adq-safari__meta-item"><?php echo (int) $durationDays; ?> <?php echo Text::_('TPL_ADEQUATE_DAYS'); ?><?php echo $durationNights ? ' / ' . (int) $durationNights . ' ' . Text::_('TPL_ADEQUATE_NIGHTS') : ''; ?></li>
                <?php endif; ?>
                <?php if ($tier) : ?>
                <li class="adq-safari__meta-item"><?php echo htmlspecialchars(ucwords(str_replace('_', ' ', (string) $tier)), ENT_QUOTES, 'UTF-8'); ?></li>
                <?php endif; ?>
            </ul>

            <div class="adq-safari__cta">
                <a class="adq-btn adq-btn--primary"
                   data-adq-book
                   data-safari="<?php echo htmlspecialchars($item->alias, ENT_QUOTES, 'UTF-8'); ?>"
                   data-safariId="<?php echo (int) $item->id; ?>"
                   href="<?php echo htmlspecialchars($bookingUrl, ENT_QUOTES, 'UTF-8'); ?>">
                    <?php echo Text::_('TPL_ADEQUATE_BOOK_THIS_SAFARI'); ?>
                </a>
                <a class="adq-btn adq-btn--ghost" data-adq-plan
                   href="<?php echo htmlspecialchars($itineraryUrl, ENT_QUOTES, 'UTF-8'); ?>">
                    <?php echo Text::_('TPL_ADEQUATE_CUSTOMISE_ITINERARY'); ?>
                </a>
            </div>
        </div>
    </header>

    <div class="container adq-safari__body">
        <div class="adq-safari__content" itemprop="description">
            <?php if ($this->params->get('show_intro', 1) && $item->introtext) : ?>
                <?php echo HTMLHelper::_('content.prepare', $item->introtext, '', 'com_content.article'); ?>
            <?php endif; ?>
            <?php if ($item->fulltext) : ?>
                <?php echo HTMLHelper::_('content.prepare', $item->fulltext, '', 'com_content.article'); ?>
            <?php endif; ?>
        </div>

        <aside class="adq-safari__sidebar">
            <div class="adq-card adq-card--price">
                <?php if ($basePriceUsd) : ?>
                <p class="adq-card__label"><?php echo Text::_('TPL_ADEQUATE_FROM'); ?></p>
                <p class="adq-card__price" itemprop="offers" itemscope itemtype="https://schema.org/Offer">
                    <meta itemprop="priceCurrency" content="USD" />
                    <span itemprop="price" content="<?php echo (int) $basePriceUsd; ?>">$<?php echo number_format((float) $basePriceUsd); ?></span>
                    <span class="adq-card__unit">/ <?php echo Text::_('TPL_ADEQUATE_PER_PERSON'); ?></span>
                </p>
                <?php endif; ?>
                <a class="adq-btn adq-btn--primary adq-btn--block"
                   data-adq-book data-safariId="<?php echo (int) $item->id; ?>"
                   href="<?php echo htmlspecialchars($bookingUrl, ENT_QUOTES, 'UTF-8'); ?>">
                    <?php echo Text::_('TPL_ADEQUATE_CHECK_AVAILABILITY'); ?>
                </a>
                <?php if (preg_replace('/\D+/', '', (string) $params->get('phoneWhatsapp', '')) !== '') : ?>
                <a class="adq-btn adq-btn--ghost adq-btn--block"
                   href="https://wa.me/<?php echo preg_replace('/\D+/', '', (string) $params->get('phoneWhatsapp', '')); ?>">
                    <?php echo Text::_('TPL_ADEQUATE_WHATSAPP_US'); ?>
                </a>
                <?php endif; ?>
            </div>

            <?php if ($highlights) : ?>
            <div class="adq-card">
                <h3 class="adq-card__title"><?php echo Text::_('TPL_ADEQUATE_HIGHLIGHTS'); ?></h3>
                <ul class="adq-list adq-list--check">
                    <?php foreach ($highlights as $h) : ?>
                    <li><?php echo htmlspecialchars($h, ENT_QUOTES, 'UTF-8'); ?></li>
                    <?php endforeach; ?>
                </ul>
            </div>
            <?php endif; ?>

            <?php if ($includes) : ?>
            <div class="adq-card">
                <h3 class="adq-card__title"><?php echo Text::_('TPL_ADEQUATE_INCLUDES'); ?></h3>
                <ul class="adq-list adq-list--check">
                    <?php foreach ($includes as $i) : ?>
                    <li><?php echo htmlspecialchars($i, ENT_QUOTES, 'UTF-8'); ?></li>
                    <?php endforeach; ?>
                </ul>
            </div>
            <?php endif; ?>

            <?php if ($excludes) : ?>
            <div class="adq-card">
                <h3 class="adq-card__title"><?php echo Text::_('TPL_ADEQUATE_EXCLUDES'); ?></h3>
                <ul class="adq-list adq-list--cross">
                    <?php foreach ($excludes as $x) : ?>
                    <li><?php echo htmlspecialchars($x, ENT_QUOTES, 'UTF-8'); ?></li>
                    <?php endforeach; ?>
                </ul>
            </div>
            <?php endif; ?>
        </aside>
    </div>
</article>