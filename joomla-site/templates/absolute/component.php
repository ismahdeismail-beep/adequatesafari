<?php
/**
 * @package     Absolute Adventure Safaris
 * @subpackage  tpl_absolute
 * component.php — render component output only (for modal / print / ajax views).
 */
defined('_JEXEC') or die;
?>
<!DOCTYPE html>
<html lang="<?php echo $this->language; ?>" dir="<?php echo $this->direction; ?>">
<head>
    <jdoc:include type="metas" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <jdoc:include type="styles" />
</head>
<body class="aas-component contentpane<?php echo $this->pageclass_sfx; ?>">
    <div class="aas-component__inner">
        <jdoc:include type="message" />
        <jdoc:include type="component" />
    </div>
    <jdoc:include type="scripts" />
</body>
</html>