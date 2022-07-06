<?php
function _ws_block_page_title($a) {
  $a['className'] = 'wp-block-ws-page-title ' . ($a['className'] ?? '');
  $heading = !empty($a['heading']) ? $a['heading'] : get_the_title();
  ob_start(); ?>
    <h1 class="<?= $a['className']; ?>"><?= $heading; ?></h1>
  <?php
  return ob_get_clean();
}
