<?php
/**
 * @package     Adequate Safaris
 * @subpackage  mod_safari_search
 * Default layout.
 *
 * @var  string  $heading
 * @var  string  $subheading
 * @var  string  $formAction
 * @var  string  $formMethod
 * @var  array   $fields
 * @var  array   $destinations
 * @var  array   $types
 * @var  array   $durations
 */

defined('_JEXEC') or die;

use Joomla\CMS\Language\Text;
?>
<div class="adq-search-widget">
    <?php if ($heading) : ?>
        <h2 class="adq-search-widget__heading"><?php echo htmlspecialchars($heading, ENT_QUOTES, 'UTF-8'); ?></h2>
    <?php endif; ?>
    <?php if ($subheading) : ?>
        <p class="adq-search-widget__subheading"><?php echo htmlspecialchars($subheading, ENT_QUOTES, 'UTF-8'); ?></p>
    <?php endif; ?>

    <form class="adq-search-widget__form"
          action="<?php echo htmlspecialchars($formAction, ENT_QUOTES, 'UTF-8'); ?>"
          method="<?php echo htmlspecialchars($formMethod, ENT_QUOTES, 'UTF-8'); ?>">

        <?php if (in_array('destination', $fields, true)) : ?>
        <div class="adq-field">
            <label for="adq-search-destination"><?php echo Text::_('MOD_SAFARI_SEARCH_FIELD_DESTINATION'); ?></label>
            <select id="adq-search-destination" name="park">
                <?php foreach ($destinations as $value => $label) : ?>
                    <option value="<?php echo htmlspecialchars($value, ENT_QUOTES, 'UTF-8'); ?>">
                        <?php echo htmlspecialchars($label, ENT_QUOTES, 'UTF-8'); ?>
                    </option>
                <?php endforeach; ?>
            </select>
        </div>
        <?php endif; ?>

        <?php if (in_array('type', $fields, true)) : ?>
        <div class="adq-field">
            <label for="adq-search-type"><?php echo Text::_('MOD_SAFARI_SEARCH_FIELD_TYPE'); ?></label>
            <select id="adq-search-type" name="type">
                <?php foreach ($types as $value => $label) : ?>
                    <option value="<?php echo htmlspecialchars($value, ENT_QUOTES, 'UTF-8'); ?>">
                        <?php echo htmlspecialchars($label, ENT_QUOTES, 'UTF-8'); ?>
                    </option>
                <?php endforeach; ?>
            </select>
        </div>
        <?php endif; ?>

        <?php if (in_array('duration', $fields, true)) : ?>
        <div class="adq-field">
            <label for="adq-search-duration"><?php echo Text::_('MOD_SAFARI_SEARCH_FIELD_DURATION'); ?></label>
            <select id="adq-search-duration" name="duration">
                <?php foreach ($durations as $value => $label) : ?>
                    <option value="<?php echo htmlspecialchars($value, ENT_QUOTES, 'UTF-8'); ?>">
                        <?php echo htmlspecialchars($label, ENT_QUOTES, 'UTF-8'); ?>
                    </option>
                <?php endforeach; ?>
            </select>
        </div>
        <?php endif; ?>

        <?php if (in_array('dates', $fields, true)) : ?>
        <div class="adq-field">
            <label for="adq-search-date"><?php echo Text::_('MOD_SAFARI_SEARCH_FIELD_DATES'); ?></label>
            <input id="adq-search-date" type="date" name="date_from" min="<?php echo date('Y-m-d'); ?>" />
        </div>
        <?php endif; ?>

        <?php if (in_array('travelers', $fields, true)) : ?>
        <div class="adq-field">
            <label for="adq-search-adults"><?php echo Text::_('MOD_SAFARI_SEARCH_FIELD_TRAVELERS'); ?></label>
            <input id="adq-search-adults" type="number" name="adults" min="1" max="20" value="2" />
        </div>
        <?php endif; ?>

        <?php if (in_array('budget', $fields, true)) : ?>
        <div class="adq-field">
            <label for="adq-search-budget"><?php echo Text::_('MOD_SAFARI_SEARCH_FIELD_BUDGET'); ?></label>
            <select id="adq-search-budget" name="budget_tier">
                <option value=""><?php echo Text::_('MOD_SAFARI_SEARCH_ANY_BUDGET'); ?></option>
                <option value="budget"><?php echo Text::_('MOD_SAFARI_SEARCH_BUDGET'); ?></option>
                <option value="mid-range"><?php echo Text::_('MOD_SAFARI_SEARCH_MIDRANGE'); ?></option>
                <option value="luxury"><?php echo Text::_('MOD_SAFARI_SEARCH_LUXURY'); ?></option>
                <option value="premium"><?php echo Text::_('MOD_SAFARI_SEARCH_PREMIUM'); ?></option>
            </select>
        </div>
        <?php endif; ?>

        <button type="submit" class="adq-btn adq-btn--primary adq-search-widget__submit">
            <?php echo Text::_('MOD_SAFARI_SEARCH_SUBMIT'); ?>
        </button>
    </form>
</div>