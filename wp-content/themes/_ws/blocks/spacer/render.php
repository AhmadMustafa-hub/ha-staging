<?php
function _ws_block_spacer($a) {
  $a['className'] = 'ws-block-spacer ' . ($a['className'] ?? '') . ' ' . ($a['height'] ?? '');
  ob_start(); ?>
    <div class="<?= $a['className']; ?>"></div>
  <?php
  return ob_get_clean();
}
