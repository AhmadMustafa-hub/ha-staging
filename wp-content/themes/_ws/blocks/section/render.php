<?php
function _ws_block_section($a, $content) {
  $a['className'] = 'ws-block-section ' . ($a['className'] ?? '');
  ob_start(); ?>
    <div class="container section-container">
      <div class="row section-row">
        <div class="col-xs-12 section-col">
          <?= $content; ?>
        </div>
      </div>
    </div>
  <?php
  return _ws_block_wrapping($a, ob_get_clean());
}
