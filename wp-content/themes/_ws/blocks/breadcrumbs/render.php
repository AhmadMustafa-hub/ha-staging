<?php
function _ws_block_breadcrumbs($a) {
  $a['className'] = 'wp-block-ws-breadcrumbs ' . ($a['className'] ?? '');
  $separator = $a['separator'] ?? '/';
  $includeCurrent = $a['includeCurrent'] ?? false;
  ob_start();
    $breadcrumbs = _ws_breadcrumbs(get_permalink(get_the_ID()), $includeCurrent);
    $breadcrumbs = array_map(function($breadcrumb) {
      return '<a href="' . $breadcrumb['url'] . '">' . $breadcrumb['title'] . '</a>';
    }, $breadcrumbs);
    echo '<a href="/">[svg id="home"]</a><span class="separator">' . $separator . '</span>';
    echo implode('<span class="separator">' . $separator . '</span>', $breadcrumbs);
  return _ws_block_wrapping($a, ob_get_clean(), 'div');
}
