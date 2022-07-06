<?php
function _ws_block_tile($a, $content) {
  $a['className'] = 'wp-block-ws-tile ' . ($a['size'] ?? '') . ' ' . ($a['className'] ?? '');
  ob_start(); ?>
    <div class="inner-tile">
      <?= $content; ?>
    </div>
  <?php
  return _ws_block_wrapping($a, ob_get_clean(), 'div');
}
