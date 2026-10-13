<?php
/**
 * @package     Adequate Safaris
 * @subpackage  tpl_adequate
 * @copyright   (C) 2026 Adequate Safaris
 * @license     Proprietary
 *
 * Adequate template — API-first shell.
 * Renders minimal semantic HTML and hands interactivity to the micro-apps
 * (booking / itinerary-builder / agent-portal) via configurable URLs.
 */

defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Uri\Uri;
use Joomla\CMS\Router\Route;

/** @var Joomla\CMS\Document\HtmlDocument $this */

$app   = Factory::getApplication();
$doc   = $this->getDocument();
$wa    = $this->getWebAssetManager();
$tpl   = $this;                       // template object
$params = $tpl->params;

// ── Template params ──────────────────────────────────────────────
$siteName     = $params->get('siteName', 'Adequate Safaris');
$siteTagline  = $params->get('siteTagline', 'Leading provider of quality leisure and vacation experiences');
$logoFile     = $params->get('logoFile', '');
$faviconFile  = $params->get('faviconFile', '');

$primary      = $params->get('primaryColor', '#1a5f3a');
$secondary    = $params->get('secondaryColor', '#d4a843');
$accent       = $params->get('accentColor', '#e86c00');
$dark         = $params->get('darkColor', '#0d2d1a');
$light        = $params->get('lightColor', '#f8f9fa');

$apiBaseUrl   = rtrim($params->get('apiBaseUrl', 'https://api.adequatesafaris.com/v1'), '/');
$bookingUrl   = $params->get('bookingAppUrl', 'https://book.adequatesafaris.com');
$itineraryUrl = $params->get('itineraryAppUrl', 'https://plan.adequatesafaris.com');
$agentUrl     = $params->get('agentAppUrl', 'https://agents.adequatesafaris.com');

$enableSearch        = (bool) $params->get('enableSearch', 1);
$enableMultiLang     = (bool) $params->get('enableMultiLang', 1);
$enableCookieConsent = (bool) $params->get('enableCookieConsent', 1);
$enableAnalytics     = (bool) $params->get('enableAnalytics', 1);

$phoneKenya    = $params->get('phoneKenya', '');
$phoneWhatsapp = $params->get('phoneWhatsapp', '');
$emailGeneral  = $params->get('emailGeneral', '');
$emailBookings = $params->get('emailBookings', '');
$address       = $params->get('address', '');

$socials = array_filter([
    'Facebook'    => $params->get('facebookUrl', ''),
    'Twitter'     => $params->get('twitterUrl', ''),
    'Instagram'   => $params->get('instagramUrl', ''),
    'YouTube'     => $params->get('youtubeUrl', ''),
    'LinkedIn'    => $params->get('linkedinUrl', ''),
    'Tripadvisor' => $params->get('tripadvisorUrl', ''),
]);

// Brand colour CSS variables
$doc->addStyleDeclaration(":root{"
    . "--adq-primary:{$primary};"
    . "--adq-secondary:{$secondary};"
    . "--adq-accent:{$accent};"
    . "--adq-dark:{$dark};"
    . "--adq-light:{$light};"
    . "}");

// ── Assets ───────────────────────────────────────────────────────
$wa->registerAndUseStyle('tpl.adequate', 'templates/adequate/css/template.css', [], ['version' => '1.0.0']);
$wa->registerAndUseScript('tpl.adequate', 'templates/adequate/js/template.js', [], ['version' => '1.0.0', 'defer' => true]);

if ($faviconFile) {
    $doc->addFavicon(Uri::root() . ltrim($faviconFile, '/'));
}

// Expose runtime config to JS (micro-app hand-off)
$runtimeConfig = json_encode([
    'apiBaseUrl'   => $apiBaseUrl,
    'bookingUrl'   => $bookingUrl,
    'itineraryUrl' => $itineraryUrl,
    'agentUrl'     => $agentUrl,
    'lang'         => $app->getLanguage()->getTag(),
    'csrf'         => Joomla\CMS\Session\Session::getFormToken(),
], JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT);
$doc->addScriptDeclaration("window.ADQ_CONFIG = {$runtimeConfig};");

// Language switcher helper (Joomla native multilingual)
$langSwitcher = '';
if ($enableMultiLang && $app->getLanguageFilter()) {
    $lang = $app->getLanguage();
    // rendered via module position `lang` when assigned
}
?>
<!DOCTYPE html>
<html lang="<?php echo $this->language; ?>" dir="<?php echo $this->direction; ?>">
<head>
    <jdoc:include type="metas" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="<?php echo htmlspecialchars($primary, ENT_QUOTES, 'UTF-8'); ?>" />
    <jdoc:include type="styles" />
</head>
<body class="adq-template site <?php echo $this->direction === 'rtl' ? 'rtl' : 'ltr'; ?>">
    <a class="skip-link screen-reader-text" href="#main-content"><?php echo Text::_('TPL_ADEQUATE_SKIP_TO_CONTENT'); ?></a>

    <!-- ═══ TOP BAR ═══ -->
    <?php if ($tpl->countModules('topbar')) : ?>
    <div class="adq-topbar">
        <div class="container adq-topbar__inner">
            <jdoc:include type="modules" name="topbar" style="none" />
        </div>
    </div>
    <?php endif; ?>

    <!-- ═══ HEADER ═══ -->
    <header class="adq-header" role="banner">
        <div class="container adq-header__inner">
            <a class="adq-brand" href="<?php echo Uri::root(); ?>" aria-label="<?php echo htmlspecialchars($siteName, ENT_QUOTES, 'UTF-8'); ?>">
                <?php if ($logoFile) : ?>
                    <img class="adq-brand__logo"
                         src="<?php echo Uri::root() . ltrim($logoFile, '/'); ?>"
                         alt="<?php echo htmlspecialchars($siteName, ENT_QUOTES, 'UTF-8'); ?>" />
                <?php else : ?>
                    <span class="adq-brand__name"><?php echo htmlspecialchars($siteName, ENT_QUOTES, 'UTF-8'); ?></span>
                <?php endif; ?>
            </a>

            <nav class="adq-nav" role="navigation" aria-label="<?php echo Text::_('TPL_ADEQUATE_MAIN_MENU'); ?>">
                <jdoc:include type="modules" name="menu" style="none" />
            </nav>

            <div class="adq-header__actions">
                <?php if ($enableSearch) : ?>
                    <button type="button" class="adq-btn adq-btn--ghost" data-adq-search-toggle
                            aria-label="<?php echo Text::_('TPL_ADEQUATE_SEARCH'); ?>">&#128269;</button>
                <?php endif; ?>
                <a class="adq-btn adq-btn--primary" href="<?php echo htmlspecialchars($bookingUrl, ENT_QUOTES, 'UTF-8'); ?>">
                    <?php echo Text::_('TPL_ADEQUATE_BOOK_NOW'); ?>
                </a>
                <button type="button" class="adq-nav-toggle" data-adq-nav-toggle
                        aria-controls="adq-mobile-nav" aria-expanded="false"
                        aria-label="<?php echo Text::_('TPL_ADEQUATE_MENU'); ?>">
                    <span></span><span></span><span></span>
                </button>
            </div>
        </div>

        <?php if ($enableSearch) : ?>
        <div class="adq-search-drawer" data-adq-search-drawer hidden>
            <div class="container">
                <form class="adq-search" role="search" action="<?php echo Route::_('index.php?option=com_finder'); ?>" method="get">
                    <input type="hidden" name="option" value="com_finder" />
                    <input type="hidden" name="view" value="search" />
                    <label class="screen-reader-text" for="adq-search-input"><?php echo Text::_('TPL_ADEQUATE_SEARCH'); ?></label>
                    <input id="adq-search-input" type="search" name="q" placeholder="<?php echo Text::_('TPL_ADEQUATE_SEARCH_PLACEHOLDER'); ?>" />
                    <button type="submit" class="adq-btn adq-btn--primary"><?php echo Text::_('TPL_ADEQUATE_SEARCH'); ?></button>
                </form>
            </div>
        </div>
        <?php endif; ?>
    </header>

    <!-- ═══ MOBILE NAV ═══ -->
    <div id="adq-mobile-nav" class="adq-mobile-nav" hidden>
        <jdoc:include type="modules" name="menu" style="none" />
        <?php if ($tpl->countModules('sidebar-left')) : ?>
            <jdoc:include type="modules" name="sidebar-left" style="xhtml" />
        <?php endif; ?>
    </div>

    <!-- ═══ BREADCRUMB ═══ -->
    <?php if ($tpl->countModules('breadcrumb')) : ?>
    <div class="adq-breadcrumb">
        <div class="container">
            <jdoc:include type="modules" name="breadcrumb" style="none" />
        </div>
    </div>
    <?php endif; ?>

    <!-- ═══ MAIN ═══ -->
    <main id="main-content" class="adq-main" role="main">
        <?php if ($tpl->countModules('main-top')) : ?>
        <div class="adq-section adq-section--main-top">
            <div class="container"><jdoc:include type="modules" name="main-top" style="xhtml" /></div>
        </div>
        <?php endif; ?>

        <div class="container adq-layout">
            <?php if ($tpl->countModules('sidebar-left')) : ?>
            <aside class="adq-sidebar adq-sidebar--left" role="complementary">
                <jdoc:include type="modules" name="sidebar-left" style="xhtml" />
            </aside>
            <?php endif; ?>

            <div class="adq-content">
                <?php if ($tpl->countModules('content-top')) : ?>
                    <jdoc:include type="modules" name="content-top" style="xhtml" />
                <?php endif; ?>

                <jdoc:include type="message" />
                <jdoc:include type="component" />

                <?php if ($tpl->countModules('content-bottom')) : ?>
                    <jdoc:include type="modules" name="content-bottom" style="xhtml" />
                <?php endif; ?>
            </div>

            <?php if ($tpl->countModules('sidebar-right')) : ?>
            <aside class="adq-sidebar adq-sidebar--right" role="complementary">
                <jdoc:include type="modules" name="sidebar-right" style="xhtml" />
            </aside>
            <?php endif; ?>
        </div>

        <?php if ($tpl->countModules('main-bottom')) : ?>
        <div class="adq-section adq-section--main-bottom">
            <div class="container"><jdoc:include type="modules" name="main-bottom" style="xhtml" /></div>
        </div>
        <?php endif; ?>
    </main>

    <!-- ═══ FOOTER ═══ -->
    <?php if ($tpl->countModules('footer-top')) : ?>
    <div class="adq-footer-top">
        <div class="container"><jdoc:include type="modules" name="footer-top" style="xhtml" /></div>
    </div>
    <?php endif; ?>

    <footer class="adq-footer" role="contentinfo">
        <div class="container adq-footer__grid">
            <div class="adq-footer__col adq-footer__col--brand">
                <span class="adq-brand__name"><?php echo htmlspecialchars($siteName, ENT_QUOTES, 'UTF-8'); ?></span>
                <p class="adq-footer__tagline"><?php echo htmlspecialchars($siteTagline, ENT_QUOTES, 'UTF-8'); ?></p>
                <ul class="adq-footer__contact">
                    <?php if ($phoneKenya) : ?>
                    <li><a href="tel:<?php echo preg_replace('/\s+/', '', $phoneKenya); ?>"><?php echo htmlspecialchars($phoneKenya, ENT_QUOTES, 'UTF-8'); ?></a></li>
                    <?php endif; ?>
                    <?php if ($phoneWhatsapp) : ?>
                    <li><a href="https://wa.me/<?php echo preg_replace('/\D+/', '', $phoneWhatsapp); ?>" rel="noopener noreferrer" target="_blank">WhatsApp: <?php echo htmlspecialchars($phoneWhatsapp, ENT_QUOTES, 'UTF-8'); ?></a></li>
                    <?php endif; ?>
                    <?php if ($emailGeneral) : ?>
                    <li><a href="mailto:<?php echo htmlspecialchars($emailGeneral, ENT_QUOTES, 'UTF-8'); ?>"><?php echo htmlspecialchars($emailGeneral, ENT_QUOTES, 'UTF-8'); ?></a></li>
                    <?php endif; ?>
                    <?php if ($address) : ?>
                    <li><?php echo htmlspecialchars($address, ENT_QUOTES, 'UTF-8'); ?></li>
                    <?php endif; ?>
                </ul>
                <?php if ($socials) : ?>
                <ul class="adq-footer__social">
                    <?php foreach ($socials as $name => $url) : ?>
                    <li><a href="<?php echo htmlspecialchars($url, ENT_QUOTES, 'UTF-8'); ?>"
                           rel="noopener noreferrer" target="_blank"
                           aria-label="<?php echo htmlspecialchars($name, ENT_QUOTES, 'UTF-8'); ?>"><?php echo htmlspecialchars($name, ENT_QUOTES, 'UTF-8'); ?></a></li>
                    <?php endforeach; ?>
                </ul>
                <?php endif; ?>
            </div>

            <?php if ($tpl->countModules('footer')) : ?>
            <div class="adq-footer__col adq-footer__col--modules">
                <jdoc:include type="modules" name="footer" style="xhtml" />
            </div>
            <?php endif; ?>
        </div>

        <div class="adq-footer__bottom">
            <div class="container adq-footer__bottom-inner">
                <jdoc:include type="modules" name="footer-bottom" style="none" />
                <p class="adq-copyright">
                    &copy; <?php echo date('Y'); ?> <?php echo htmlspecialchars($siteName, ENT_QUOTES, 'UTF-8'); ?>.
                    <?php echo Text::_('TPL_ADEQUATE_ALL_RIGHTS_RESERVED'); ?>
                </p>
            </div>
        </div>
    </footer>

    <!-- ═══ COOKIE CONSENT ═══ -->
    <?php if ($enableCookieConsent) : ?>
    <div class="adq-cookie" data-adq-cookie hidden>
        <p class="adq-cookie__text"><?php echo Text::_('TPL_ADEQUATE_COOKIE_TEXT'); ?></p>
        <div class="adq-cookie__actions">
            <button type="button" class="adq-btn adq-btn--ghost" data-adq-cookie="decline"><?php echo Text::_('TPL_ADEQUATE_COOKIE_DECLINE'); ?></button>
            <button type="button" class="adq-btn adq-btn--primary" data-adq-cookie="accept"><?php echo Text::_('TPL_ADEQUATE_COOKIE_ACCEPT'); ?></button>
        </div>
    </div>
    <?php endif; ?>

    <jdoc:include type="modules" name="debug" style="none" />
    <jdoc:include type="scripts" />
</body>
</html>