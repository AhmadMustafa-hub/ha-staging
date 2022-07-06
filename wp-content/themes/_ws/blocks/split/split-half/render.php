<?php
function _ws_block_split_half($a, $content) {
  $a['className'] = 'wp-block-ws-split-half ' . ($a['className'] ?? '');
  $overflowTop = isset($a['overflowTop']) && $a['overflowTop'] ? 'overflow-top' : '';
  $overflowBottom = isset($a['overflowBottom']) && $a['overflowBottom'] ? 'overflow-bottom' : '';
  $a['className'] .= $overflowTop . ' ' . $overflowBottom;
  ob_start(); ?>
    <?= $content; ?>
  <?php
  return _ws_block_wrapping($a, ob_get_clean(), 'div');
}
