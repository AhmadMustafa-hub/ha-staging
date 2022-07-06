<?php
function _ws_block_icon_list_item($a, $content) {
  $icon = $a['icon'] ?? '';
  $iconColor = isset($a['iconColor']) ? _ws_get_color_slug($a['iconColor']) : '';
  $text = $a['text'] ?? '';
  $a['className'] = 'ws-block-icon-list ' . ($a['className'] ?? '');
  ob_start();
    echo '<li>[svg id="' . $icon . '" ' . ($iconColor ? 'class="has-' . $iconColor . '-color"' : '') . ']<span>' . $text . '</span></li>';
  return ob_get_clean();
}
