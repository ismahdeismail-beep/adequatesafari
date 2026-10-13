<?php
/**
 * @package     Adequate Safaris
 * @subpackage  tpl_adequate
 * mod_menu override — accessible, multi-level menu with animated dropdowns.
 *
 * Desktop: dropdowns open on hover/focus (CSS-driven, animated) — see the
 * ".adq-menu__sub" rules in css/template.css.
 * Mobile: each branch gets a toggle button so it can be expanded as an
 * accordion; see [data-adq-menu-toggle] handling in js/template.js.
 *
 * @var  \stdClass  $module
 * @var  array      $list
 */

defined('_JEXEC') or die;

use Joomla\CMS\Language\Text;

if (!function_exists('adqMenuRender')) {
    /**
     * Recursively render a Joomla mod_menu tree.
     *
     * @param   array  $items  Menu items (each may carry a ->submenu array).
     * @param   int    $level  Current depth (0 = top level).
     *
     * @return  string
     */
    function adqMenuRender(array $items, int $level = 0): string
    {
        $listClass = $level === 0 ? 'adq-menu__list' : 'adq-menu__sub';
        $html = '<ul class="' . $listClass . '">';

        foreach ($items as $item) {
            $children = !empty($item->submenu) ? (array) $item->submenu : [];

            $liClass = 'adq-menu__item';
            if (!empty($item->active)) { $liClass .= ' is-active'; }
            if ($children)             { $liClass .= ' has-children'; }

            $html .= '<li class="' . $liClass . '">';

            $html .= '<a class="adq-menu__link"'
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
                $html .= '<button type="button" class="adq-menu__toggle"'
                    . ' data-adq-menu-toggle aria-expanded="false"'
                    . ' aria-label="' . htmlspecialchars(
                        Text::sprintf('TPL_ADEQUATE_TOGGLE_SUBMENU', $item->title ?? ''),
                        ENT_QUOTES,
                        'UTF-8'
                    ) . '">'
                    . '<span class="adq-menu__toggle-icon" aria-hidden="true"></span>'
                    . '</button>';

                $html .= adqMenuRender($children, $level + 1);
            }

            $html .= '</li>';
        }

        return $html . '</ul>';
    }
}

$attributes = [
    'class'     => trim('adq-menu ' . ($class_sfx ?? '')),
    'itemscope' => 'itemscope',
    'itemtype'  => 'https://schema.org/SiteNavigationElement',
];
?>
<nav <?php echo \Joomla\CMS\HTML\HTMLHelper::_('arrayToAttributes', $attributes); ?>
     aria-label="<?php echo htmlspecialchars($module->title ?? 'Menu', ENT_QUOTES, 'UTF-8'); ?>">
    <?php echo adqMenuRender($list ?? []); ?>
</nav>
