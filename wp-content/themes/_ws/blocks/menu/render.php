<?php
function _ws_menu_to_html($menus) {
  $output = '<ul>';
  foreach ($menus as $menu) {
    $menuURL = parse_url($menu->url)['path'];
    $currentURL = explode('?', $_SERVER['REQUEST_URI'])[0];
    $current = $menuURL === $currentURL ? 'class="current"' : '';
    if (isset($menu->children)) {
      $output .= '<li><a ' . $current . ' href="' . $menu->url . '">' . $menu->title . '</a>' . _ws_menu_to_html($menu->children) . '</li>';
    }
    else {
      $output .= '<li><a ' . $current . ' href="' . $menu->url . '">' . $menu->title . '</a></li>';
    }
  }
  return $output . '</ul>';
}

function _ws_block_menu($a) {
  $a['className'] = 'wp-block-ws-menu ' . ($a['className'] ?? '');
  $menuId = $a['menuId'] ?? 0;
  $menuArray = $menuId ? _ws_build_menu(wp_get_nav_menu_items($menuId)) : [];
  ob_start();
    echo _ws_menu_to_html($menuArray);
  return _ws_block_wrapping($a, ob_get_clean(), 'div');
}
