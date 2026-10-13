<?php
/**
 * @package     Adequate Safaris
 * @subpackage  tpl_adequate
 * offline.php — site offline / maintenance page.
 */
defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Uri\Uri;

$app     = Factory::getApplication();
$params  = $app->getTemplate(true)->params;
$brand   = $params->get('siteName', 'Adequate Safaris');
$logo    = $params->get('logoFile', '');
$message = $this->get('message', '');
?>
<!DOCTYPE html>
<html lang="<?php echo $this->language; ?>" dir="<?php echo $this->direction; ?>">
<head>
    <jdoc:include type="metas" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <jdoc:include type="styles" />
    <style>
        body { font-family: system-ui, sans-serif; background: #0d2d1a; color: #fff; margin: 0; }
        .off-wrap { max-width: 560px; margin: 12vh auto; padding: 2rem; text-align: center; }
        .off-title { font-size: 1.75rem; margin: 1rem 0; }
        .off-msg { color: #cbd5e1; margin-bottom: 2rem; }
        .off-actions { display: flex; gap: .75rem; justify-content: center; flex-wrap: wrap; }
        .off-btn { display: inline-block; padding: .75rem 1.5rem; border-radius: .5rem; background: #d4a843; color: #0d2d1a; text-decoration: none; font-weight: 700; }
    </style>
</head>
<body class="adq-offline">
    <div class="off-wrap">
        <?php if ($logo) : ?>
            <img src="<?php echo Uri::root() . ltrim($logo, '/'); ?>" alt="<?php echo htmlspecialchars($brand, ENT_QUOTES, 'UTF-8'); ?>" style="max-height:3rem;margin:0 auto;" />
        <?php else : ?>
            <h1><?php echo htmlspecialchars($brand, ENT_QUOTES, 'UTF-8'); ?></h1>
        <?php endif; ?>
        <h2 class="off-title"><?php echo Text::_('TPL_ADEQUATE_OFFLINE_TITLE'); ?></h2>
        <p class="off-msg"><?php echo $message ?: Text::_('TPL_ADEQUATE_OFFLINE_MESSAGE'); ?></p>
        <div class="off-actions">
            <?php if ($this->params->get('offline_image')) : ?>
                <img src="<?php echo Uri::root() . ltrim($this->params->get('offline_image'), '/'); ?>" alt="" />
            <?php endif; ?>
            <a class="off-btn" href="<?php echo Uri::root(); ?>administrator/"><?php echo Text::_('TPL_ADEQUATE_OFFLINE_LOGIN'); ?></a>
        </div>
    </div>
    <jdoc:include type="scripts" />
</body>
</html>