<?php
function _ws_block_tabbed_panels($a, $content) {
  $a['className'] = 'wp-block-ws-tabbed-panels ' . ($a['className'] ?? '');
  ob_start(); ?>
    <div class="tabs"></div>
    <div class="panels">
      <?= $content; ?>
    </div>
  <?php
  return _ws_block_wrapping($a, ob_get_clean(), 'div');
}
