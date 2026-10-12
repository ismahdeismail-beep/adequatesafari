<?php
/**
 * @package     Absolute Adventure Safaris
 * @subpackage  tpl_absolute
 * @copyright   (C) 2026 Absolute Adventure Safaris
 * @license     Proprietary
 *
 * Absolute template — API-first shell.
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
$siteName     = $params->get('siteName', 'Absolute Adventure Safaris');
$siteTagline  = $params->get('siteTagline', 'Leading provider of quality leisure and vacation experiences');
$logoFile     = $params->get('logoFile', '');
$faviconFile  = $params->get('faviconFile', '');

$primary      = $params->get('primaryColor', '#1a5f3a');
$secondary    = $params->get('secondaryColor', '#d4a843');
$accent       = $params->get('accentColor', '#e86c00');
$dark         = $params->get('darkColor', '#0d2d1a');
$light        = $params->get('lightColor', '#f8f9fa');

$apiBaseUrl   = rtrim($params->get('apiBaseUrl', 'https://api.absoluteadventuresafaris.com/v1'), '/');
$bookingUrl   = $params->get('bookingAppUrl', 'https://book.absoluteadventuresafaris.com');
$itineraryUrl = $params->get('itineraryAppUrl', 'https://plan.absoluteadventuresafaris.com');
$agentUrl     = $params->get('agentAppUrl', 'https://agents.absoluteadventuresafaris.com');

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
    . "--aas-primary:{$primary};"
    . "--aas-secondary:{$secondary};"
    . "--aas-accent:{$accent};"
    . "--aas-dark:{$dark};"
    . "--aas-light:{$light};"
    . "}");

// ── Assets ───────────────────────────────────────────────────────
$wa->registerAndUseStyle('tpl.absolute', 'templates/absolute/css/template.css', [], ['version' => '1.0.0']);
$wa->registerAndUseScript('tpl.absolute', 'templates/absolute/js/template.js', [], ['version' => '1.0.0', 'defer' => true]);

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
$doc->addScriptDeclaration("window.AAS_CONFIG = {$runtimeConfig};");

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
<body class="aas-template site <?php echo $this->direction === 'rtl' ? 'rtl' : 'ltr'; ?>">
    <a class="skip-link screen-reader-text" href="#main-content"><?php echo Text::_('TPL_ABSOLUTE_SKIP_TO_CONTENT'); ?></a>

    <!-- ═══ TOP BAR ═══ -->
    <?php if ($tpl->countModules('topbar')) : ?>
    <div class="aas-topbar">
        <div class="container aas-topbar__inner">
            <jdoc:include type="modules" name="topbar" style="none" />
        </div>
    </div>
    <?php endif; ?>

    <!-- ═══ HEADER ═══ -->
    <header class="aas-header" role="banner">
        <div class="container aas-header__inner">
            <a class="aas-brand" href="<?php echo Uri::root(); ?>" aria-label="<?php echo htmlspecialchars($siteName, ENT_QUOTES, 'UTF-8'); ?>">
                <?php if ($logoFile) : ?>
                    <img class="aas-brand__logo"
                         src="<?php echo Uri::root() . ltrim($logoFile, '/'); ?>"
                         alt="<?php echo htmlspecialchars($siteName, ENT_QUOTES, 'UTF-8'); ?>" />
                <?php else : ?>
                    <span class="aas-brand__name"><?php echo htmlspecialchars($siteName, ENT_QUOTES, 'UTF-8'); ?></span>
                <?php endif; ?>
            </a>

            <nav class="aas-nav" role="navigation" aria-label="<?php echo Text::_('TPL_ABSOLUTE_MAIN_MENU'); ?>">
                <jdoc:include type="modules" name="menu" style="none" />
            </nav>

            <div class="aas-header__actions">
                <?php if ($enableSearch) : ?>
                    <button type="button" class="aas-btn aas-btn--ghost" data-aas-search-toggle
                            aria-label="<?php echo Text::_('TPL_ABSOLUTE_SEARCH'); ?>">&#128269;</button>
                <?php endif; ?>
                <a class="aas-btn aas-btn--primary" href="<?php echo htmlspecialchars($bookingUrl, ENT_QUOTES, 'UTF-8'); ?>">
                    <?php echo Text::_('TPL_ABSOLUTE_BOOK_NOW'); ?>
                </a>
                <button type="button" class="aas-nav-toggle" data-aas-nav-toggle
                        aria-controls="aas-mobile-nav" aria-expanded="false"
                        aria-label="<?php echo Text::_('TPL_ABSOLUTE_MENU'); ?>">
                    <span></span><span></span><span></span>
                </button>
            </div>
        </div>

        <?php if ($enableSearch) : ?>
        <div class="aas-search-drawer" data-aas-search-drawer hidden>
            <div class="container">
                <form class="aas-search" role="search" action="<?php echo Route::_('index.php?option=com_finder'); ?>" method="get">
                    <input type="hidden" name="option" value="com_finder" />
                    <input type="hidden" name="view" value="search" />
                    <label class="screen-reader-text" for="aas-search-input"><?php echo Text::_('TPL_ABSOLUTE_SEARCH'); ?></label>
                    <input id="aas-search-input" type="search" name="q" placeholder="<?php echo Text::_('TPL_ABSOLUTE_SEARCH_PLACEHOLDER'); ?>" />
                    <button type="submit" class="aas-btn aas-btn--primary"><?php echo Text::_('TPL_ABSOLUTE_SEARCH'); ?></button>
                </form>
            </div>
        </div>
        <?php endif; ?>
    </header>

    <!-- ═══ MOBILE NAV ═══ -->
    <div id="aas-mobile-nav" class="aas-mobile-nav" hidden>
        <jdoc:include type="modules" name="menu" style="none" />
        <?php if ($tpl->countModules('sidebar-left')) : ?>
            <jdoc:include type="modules" name="sidebar-left" style="xhtml" />
        <?php endif; ?>
    </div>

    <!-- ═══ BREADCRUMB ═══ -->
    <?php if ($tpl->countModules('breadcrumb')) : ?>
    <div class="aas-breadcrumb">
        <div class="container">
            <jdoc:include type="modules" name="breadcrumb" style="none" />
        </div>
    </div>
    <?php endif; ?>

    <!-- ═══ MAIN ═══ -->
    <main id="main-content" class="aas-main" role="main">
        <?php if ($tpl->countModules('main-top')) : ?>
        <div class="aas-section aas-section--main-top">
            <div class="container"><jdoc:include type="modules" name="main-top" style="xhtml" /></div>
        </div>
        <?php endif; ?>

        <div class="container aas-layout">
            <?php if ($tpl->countModules('sidebar-left')) : ?>
            <aside class="aas-sidebar aas-sidebar--left" role="complementary">
                <jdoc:include type="modules" name="sidebar-left" style="xhtml" />
            </aside>
            <?php endif; ?>

            <div class="aas-content">
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
            <aside class="aas-sidebar aas-sidebar--right" role="complementary">
                <jdoc:include type="modules" name="sidebar-right" style="xhtml" />
            </aside>
            <?php endif; ?>
        </div>

        <?php if ($tpl->countModules('main-bottom')) : ?>
        <div class="aas-section aas-section--main-bottom">
            <div class="container"><jdoc:include type="modules" name="main-bottom" style="xhtml" /></div>
        </div>
        <?php endif; ?>
    </main>

    <!-- ═══ FOOTER ═══ -->
    <?php if ($tpl->countModules('footer-top')) : ?>
    <div class="aas-footer-top">
        <div class="container"><jdoc:include type="modules" name="footer-top" style="xhtml" /></div>
    </div>
    <?php endif; ?>

    <footer class="aas-footer" role="contentinfo">
        <div class="container aas-footer__grid">
            <div class="aas-footer__col aas-footer__col--brand">
                <span class="aas-brand__name"><?php echo htmlspecialchars($siteName, ENT_QUOTES, 'UTF-8'); ?></span>
                <p class="aas-footer__tagline"><?php echo htmlspecialchars($siteTagline, ENT_QUOTES, 'UTF-8'); ?></p>
                <ul class="aas-footer__contact">
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
                <ul class="aas-footer__social">
                    <?php foreach ($socials as $name => $url) : ?>
                    <li><a href="<?php echo htmlspecialchars($url, ENT_QUOTES, 'UTF-8'); ?>"
                           rel="noopener noreferrer" target="_blank"
                           aria-label="<?php echo htmlspecialchars($name, ENT_QUOTES, 'UTF-8'); ?>"><?php echo htmlspecialchars($name, ENT_QUOTES, 'UTF-8'); ?></a></li>
                    <?php endforeach; ?>
                </ul>
                <?php endif; ?>
            </div>

            <?php if ($tpl->countModules('footer')) : ?>
            <div class="aas-footer__col aas-footer__col--modules">
                <jdoc:include type="modules" name="footer" style="xhtml" />
            </div>
            <?php endif; ?>
        </div>

        <div class="aas-footer__bottom">
            <div class="container aas-footer__bottom-inner">
                <jdoc:include type="modules" name="footer-bottom" style="none" />
                <p class="aas-copyright">
                    &copy; <?php echo date('Y'); ?> <?php echo htmlspecialchars($siteName, ENT_QUOTES, 'UTF-8'); ?>.
                    <?php echo Text::_('TPL_ABSOLUTE_ALL_RIGHTS_RESERVED'); ?>
                </p>
            </div>
        </div>
    </footer>

    <!-- ═══ COOKIE CONSENT ═══ -->
    <?php if ($enableCookieConsent) : ?>
    <div class="aas-cookie" data-aas-cookie hidden>
        <p class="aas-cookie__text"><?php echo Text::_('TPL_ABSOLUTE_COOKIE_TEXT'); ?></p>
        <div class="aas-cookie__actions">
            <button type="button" class="aas-btn aas-btn--ghost" data-aas-cookie="decline"><?php echo Text::_('TPL_ABSOLUTE_COOKIE_DECLINE'); ?></button>
            <button type="button" class="aas-btn aas-btn--primary" data-aas-cookie="accept"><?php echo Text::_('TPL_ABSOLUTE_COOKIE_ACCEPT'); ?></button>
        </div>
    </div>
    <?php endif; ?>

    <jdoc:include type="modules" name="debug" style="none" />
    <jdoc:include type="scripts" />
</body>
</html>