<?php
function _ws_block_social_share($a) {
  $a['className'] = 'ws-block-social-share ' . ($a['className'] ?? '');
  $pdf = $a['pdf'] ?? '';
  ob_start(); ?>
    <div class="<?= $a['className']; ?>">
      <h3>Share:</h3>
      <?= do_shortcode('[share_buttons pdf="' . wp_get_attachment_url($pdf) . '"]'); ?>
    </div>
  <?php
  return ob_get_clean();
}
