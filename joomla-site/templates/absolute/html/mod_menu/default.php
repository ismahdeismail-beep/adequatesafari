<?php
/**
 * @package     Absolute Adventure Safaris
 * @subpackage  tpl_absolute
 * mod_menu override — accessible, multi-level menu with animated dropdowns.
 *
 * Desktop: dropdowns open on hover/focus (CSS-driven, animated) — see the
 * ".aas-menu__sub" rules in css/template.css.
 * Mobile: each branch gets a toggle button so it can be expanded as an
 * accordion; see [data-aas-menu-toggle] handling in js/template.js.
 *
 * @var  \stdClass  $module
 * @var  array      $list
 */

defined('_JEXEC') or die;

use Joomla\CMS\Language\Text;

if (!function_exists('aasMenuRender')) {
    /**
     * Recursively render a Joomla mod_menu tree.
     *
     * @param   array  $items  Menu items (each may carry a ->submenu array).
     * @param   int    $level  Current depth (0 = top level).
     *
     * @return  string
     */
    function aasMenuRender(array $items, int $level = 0): string
    {
        $listClass = $level === 0 ? 'aas-menu__list' : 'aas-menu__sub';
        $html = '<ul class="' . $listClass . '">';

        foreach ($items as $item) {
            $children = !empty($item->submenu) ? (array) $item->submenu : [];

            $liClass = 'aas-menu__item';
            if (!empty($item->active)) { $liClass .= ' is-active'; }
            if ($children)             { $liClass .= ' has-children'; }

            $html .= '<li class="' . $liClass . '">';

            $html .= '<a class="aas-menu__link"'
                . ' href="' . htmlspecialchars($item->flink ?? '#', ENT_QUOTES, 'UTF-8') . '"'
                . ' itemprop="url"'
                . (!empty($item->anchor_title)
                    ? ' title="' . htmlspecialchars($item->anchor_title, ENT_QUOTES, 'UTF-8') . '"'
                    : '')
                . '><span itemprop="name">'
                . htmlspecialchars($item->title ?? '', ENT_QUOTES, 'UTF-8')
                . '</span></a>';

            if ($children) {
                // Mobile-only disclosure control; the desktop dropdown is hover-driven.
                $html .= '<button type="button" class="aas-menu__toggle"'
                    . ' data-aas-menu-toggle aria-expanded="false"'
                    . ' aria-label="' . htmlspecialchars(
                        Text::sprintf('TPL_ABSOLUTE_TOGGLE_SUBMENU', $item->title ?? ''),
                        ENT_QUOTES,
                        'UTF-8'
                    ) . '">'
                    . '<span class="aas-menu__toggle-icon" aria-hidden="true"></span>'
                    . '</button>';

                $html .= aasMenuRender($children, $level + 1);
            }

            $html .= '</li>';
        }

        return $html . '</ul>';
    }
}

$attributes = [
    'class'     => trim('aas-menu ' . ($class_sfx ?? '')),
    'itemscope' => 'itemscope',
    'itemtype'  => 'https://schema.org/SiteNavigationElement',
];
?>
<nav <?php echo \Joomla\CMS\HTML\HTMLHelper::_('arrayToAttributes', $attributes); ?>
     aria-label="<?php echo htmlspecialchars($module->title ?? 'Menu', ENT_QUOTES, 'UTF-8'); ?>">
    <?php echo aasMenuRender($list ?? []); ?>
</nav>
