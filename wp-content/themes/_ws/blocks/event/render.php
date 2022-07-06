<?php
function _ws_block_event($a) {
  $a['className'] = 'wp-block-ws-event ' . ($a['className'] ?? '');
  $date = $a['date'] ?? '';
  $name = $a['name'] ?? '';
  ob_start(); ?>
    <p class="subhead"><?= $date; ?></p>
    <h3><?= $name; ?></h3>
  <?php
  return _ws_block_wrapping($a, ob_get_clean(), 'div');
}
