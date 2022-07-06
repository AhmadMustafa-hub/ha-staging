<?php
function _ws_block_tiles($a, $content) {
  $a['className'] = 'wp-block-ws-tiles ' . ($a['className'] ?? '');
  ob_start(); ?>
    <div class="grid">
      <?= $content; ?>
    </div>
  <?php
  return _ws_block_wrapping($a, ob_get_clean(), 'div');
}
