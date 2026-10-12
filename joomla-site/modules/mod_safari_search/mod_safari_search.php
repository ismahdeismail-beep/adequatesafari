<?php
/**
 * @package     Absolute Adventure Safaris
 * @subpackage  mod_safari_search
 *
 * Renders a safari search form. On submit it either redirects into the
 * booking micro-app (default) or to a Joomla menu item (com_content filtered).
 */

defined('_JEXEC') or die;

use Joomla\CMS\Helper\ModuleHelper;
use Joomla\CMS\Router\Route;
use Joomla\CMS\Uri\Uri;

/** @var \stdClass $module */
/** @var \Joomla\Registry\Registry $params */

$heading     = $params->get('heading', 'Find your perfect safari');
$subheading   = $params->get('subheading', '');
$redirectMode = $params->get('redirect_mode', 'booking');
$bookingUrl   = rtrim((string) $params->get('booking_url', 'https://book.absoluteadventuresafaris.com'), '/');
$joomlaMenuId = (int) $params->get('joomla_menuid', 0);

$fieldsRaw = $params->get('enabled_fields', []);
$fields    = is_array($fieldsRaw) ? $fieldsRaw : (array) $fieldsRaw;
if (empty($fields)) {
    $fields = ['destination', 'type', 'duration', 'dates', 'travelers'];
}
// checkboxes may come back as {"destination":1,...}
if (array_keys($fields) !== range(0, count($fields) - 1)) {
    $fields = array_keys(array_filter($fields));
}

// Form target + method
if ($redirectMode === 'joomla' && $joomlaMenuId) {
    $formAction = Route::_('index.php?Itemid=' . $joomlaMenuId);
    $formMethod = 'get';
} else {
    $formAction = $bookingUrl;
    $formMethod = 'get';
}

// Destinations (parks) for the select
$destinations = [
    ''            => 'Any destination',
    'masai-mara'  => 'Masai Mara',
    'amboseli'    => 'Amboseli',
    'tsavo'       => 'Tsavo East & West',
    'lake-nakuru' => 'Lake Nakuru',
    'samburu'     => 'Samburu',
    'aberdare'    => 'Aberdares',
    'meru'        => 'Meru',
    'mount-kenya' => 'Mount Kenya',
    'serengeti'   => 'Serengeti',
    'ngorongoro'  => 'Ngorongoro',
    'bwindi'      => 'Bwindi (Uganda)',
    'zanzibar'    => 'Zanzibar',
];

$types = [
    ''        => 'Any style',
    'lodge'   => 'Lodge safari',
    'camping' => 'Camping safari',
    'flying'  => 'Flying safari',
    'trek'    => 'Trekking / climb',
];

$durations = [
    ''  => 'Any duration',
    '2' => '1–2 days',
    '3' => '3 days',
    '4' => '4 days',
    '5' => '5 days',
    '6' => '6 days',
    '7' => '7 days',
    '8' => '8–9 days',
    '14' => '10+ days',
];

require ModuleHelper::getLayoutPath('mod_safari_search', $params->get('layout', 'default'));