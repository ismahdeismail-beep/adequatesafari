<?php
/**
 * @package     Adequate Safaris
 * @subpackage  tpl_adequate
 * error.php — custom error page (404, 403, 500).
 */
defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Uri\Uri;

$app    = Factory::getApplication();
$params = $app->getTemplate(true)->params;
$brand  = $params->get('siteName', 'Adequate Safaris');
$logo   = $params->get('logoFile', '');
$code   = $this->error->getCode();
$msg    = htmlspecialchars($this->error->getMessage(), ENT_QUOTES, 'UTF-8');

$headings = [
    403 => 'TPL_ADEQUATE_ERR_403',
    404 => 'TPL_ADEQUATE_ERR_404',
    500 => 'TPL_ADEQUATE_ERR_500',
];
$heading = isset($headings[$code]) ? Text::_($headings[$code]) : Text::_('TPL_ADEQUATE_ERR_GENERIC');
?>
<!DOCTYPE html>
<html lang="<?php echo $this->language; ?>" dir="<?php echo $this->direction; ?>">
<head>
    <jdoc:include type="metas" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <jdoc:include type="styles" />
    <style>
        body { font-family: system-ui, sans-serif; background: #f8f9fa; color: #1f2937; margin: 0; }
        .err-wrap { max-width: 640px; margin: 8vh auto; padding: 2rem; text-align: center; }
        .err-code { font-size: 5rem; font-weight: 800; color: #1a5f3a; line-height: 1; margin: 0; }
        .err-title { font-size: 1.5rem; margin: .5rem 0 1rem; }
        .err-msg { color: #6b7280; margin-bottom: 2rem; word-break: break-word; }
        .err-actions { display: flex; gap: .75rem; justify-content: center; flex-wrap: wrap; }
        .err-btn { display: inline-block; padding: .75rem 1.5rem; border-radius: .5rem; background: #1a5f3a; color: #fff; text-decoration: none; font-weight: 600; }
        .err-btn--ghost { background: transparent; color: #1a5f3a; border: 2px solid #1a5f3a; }
    </style>
</head>
<body class="adq-error">
    <div class="err-wrap">
        <?php if ($logo) : ?>
            <img src="<?php echo Uri::root() . ltrim($logo, '/'); ?>" alt="<?php echo htmlspecialchars($brand, ENT_QUOTES, 'UTF-8'); ?>" style="max-height:3rem;margin:0 auto 1.5rem;" />
        <?php endif; ?>
        <p class="err-code"><?php echo (int) $code; ?></p>
        <h1 class="err-title"><?php echo htmlspecialchars($heading, ENT_QUOTES, 'UTF-8'); ?></h1>
        <?php if ($app->get('debug')) : ?>
            <p class="err-msg"><?php echo $msg; ?></p>
        <?php else : ?>
            <p class="err-msg"><?php echo Text::_('TPL_ADEQUATE_ERR_HINT'); ?></p>
        <?php endif; ?>
        <div class="err-actions">
            <a class="err-btn" href="<?php echo Uri::root(); ?>"><?php echo Text::_('TPL_ADEQUATE_GO_HOME'); ?></a>
            <a class="err-btn err-btn--ghost" href="<?php echo Uri::root(); ?>index.php?option=com_content&view=featured"><?php echo Text::_('TPL_ADEQUATE_BROWSE_SAFARIS'); ?></a>
        </div>
    </div>
    <jdoc:include type="scripts" />
</body>
</html>