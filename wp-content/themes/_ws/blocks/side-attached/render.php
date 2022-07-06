<?php
function _ws_block_side_attached($a, $content) {
  $a['className'] = 'wp-block-ws-side-attached ' . ($a['className'] ?? '');
  ob_start(); ?>
    <div class="side-attached-content">
      <?= $content; ?>
    </div>
  <?php
  return _ws_block_wrapping($a, ob_get_clean(), 'div');
}
