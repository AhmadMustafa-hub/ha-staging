<?php
function _ws_block_panel($a, $content) {
  $uid = $a['uid'] ?? '';
  $heading = $a['heading'] ?? '';
  ob_start(); ?>
    <div
      id="panel-<?= $uid ?>"
      class="panel"
      data-heading="<?= $heading; ?>"
    >
      <?= $content; ?>
    </div>
  <?php
  return ob_get_clean();
}
