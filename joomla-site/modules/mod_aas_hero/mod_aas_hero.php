<?php
/**
 * @package     Absolute Adventure Safaris
 * @subpackage  mod_aas_hero
 *
 * Hero carousel with controlled motion (crossfade + subtle Ken Burns).
 * Slides are configurable in the module admin; sensible defaults ship with
 * the template's own imagery so the module works out of the box.
 */

defined('_JEXEC') or die;

use Joomla\CMS\Helper\ModuleHelper;

/** @var \stdClass $module */
/** @var \Joomla\Registry\Registry $params */

$height       = $params->get('height', 'large');
$autoplay     = (bool) $params->get('autoplay', 1);
$interval     = max(2000, (int) $params->get('interval', 6000));
$motion       = $params->get('motion', 'kenburns');        // kenburns | fade | none
$showCaptions = (bool) $params->get('show_captions', 1);
$showControls = (bool) $params->get('show_controls', 1);
$showProgress = (bool) $params->get('show_progress', 1);
$overlay      = $params->get('overlay', 'tinted');          // none | light | tinted | strong

// ── Slides ──────────────────────────────────────────────────────
$slides = $params->get('slides_data', []);
if (is_string($slides)) {
    $decoded = json_decode($slides, true);
    $slides = is_array($decoded) ? $decoded : [];
}

// Defaults built from the template's own hero imagery.
if (empty($slides)) {
    $base = 'templates/absolute/images/hero/';
    $slides = [
        [
            'image'       => $base . 'slider1.jpg',
            'eyebrow'     => 'Absolute Adventure Safaris',
            'heading'     => 'Discover the wild heart of East Africa',
            'subtext'     => 'Leading provider of quality leisure and vacation experiences and services.',
            'button_text' => 'Book a safari',
            'button_url'  => '#',
            'align'       => 'left',
        ],
        [
            'image'       => $base . 'slider5.jpg',
            'eyebrow'     => 'Masai Mara',
            'heading'     => 'Witness the Great Wildebeest Migration',
            'subtext'     => 'Wildlife and bird-viewing in the Masai Mara — we will take you there.',
            'button_text' => 'See migration safaris',
            'button_url'  => '#',
            'align'       => 'left',
        ],
        [
            'image'       => $base . 'slider2.jpg',
            'eyebrow'     => 'Mount Kenya & Kilimanjaro',
            'heading'     => 'Climb the roof of Africa',
            'subtext'     => 'Guided treks on the Sirimon, Naromoru, Machame and Marangu routes.',
            'button_text' => 'Explore climbs',
            'button_url'  => '#',
            'align'       => 'left',
        ],
        [
            'image'       => $base . 'slider4.jpg',
            'eyebrow'     => 'Tailor-made itineraries',
            'heading'     => 'Your safari, your way',
            'subtext'     => 'Build a custom itinerary across Kenya, Tanzania and Uganda.',
            'button_text' => 'Plan your trip',
            'button_url'  => '#',
            'align'       => 'left',
        ],
        [
            'image'       => $base . 'slider7.jpg',
            'eyebrow'     => 'Beach & bush',
            'heading'     => 'From the savannah to the Indian Ocean',
            'subtext'     => 'Combine game drives with the beaches of Lamu and Zanzibar.',
            'button_text' => 'Beach escapes',
            'button_url'  => '#',
            'align'       => 'left',
        ],
    ];
}

// Normalise slide entries (subform can return assoc arrays or objects).
$normalised = [];
foreach ($slides as $slide) {
    $slide = (array) $slide;
    if (empty($slide['image']) && empty($slide['heading'])) {
        continue;
    }
    $normalised[] = [
        'image'        => $slide['image'] ?? '',
        'eyebrow'      => $slide['eyebrow'] ?? '',
        'heading'      => $slide['heading'] ?? '',
        'subtext'      => $slide['subtext'] ?? '',
        'button_text'  => $slide['button_text'] ?? '',
        'button_url'   => $slide['button_url'] ?? '',
        'button2_text' => $slide['button2_text'] ?? '',
        'button2_url'  => $slide['button2_url'] ?? '',
        'align'        => ($slide['align'] ?? 'left') === 'center' ? 'center' : 'left',
    ];
}
$slides = $normalised;

if (empty($slides)) {
    return;
}

$uid = 'aas-hero-' . $module->id;

// Module-scoped assets (works in any template).
$wa = \Joomla\CMS\Factory::getApplication()->getDocument()->getWebAssetManager();
$wa->registerAndUseStyle('mod_aas_hero', 'modules/mod_aas_hero/tmpl/hero.css', [], ['version' => '1.0.0']);
$wa->registerAndUseScript('mod_aas_hero', 'modules/mod_aas_hero/tmpl/hero.js', [], ['version' => '1.0.0', 'defer' => true]);

require ModuleHelper::getLayoutPath('mod_aas_hero', $params->get('layout', 'default'));