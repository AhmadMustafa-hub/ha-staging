<?php
function _ws_block_card($a, $content) {
  $a['className'] = 'wp-block-ws-card card ' . ($a['className'] ?? '');
  $padding = isset($a['padding']) && $a['padding'] ? ' extra-padding' : '';
  $image = $a['image'] ?? '';
  $imageX = $a['imageX'] ?? '';
  $imageY = $a['imageY'] ?? '';
  $imagePosition = isset($a['imagePosition']) && $a['imagePosition'] ? ' image-' . $a['imagePosition'] : '';
  $a['className'] .= $imagePosition . $padding;
  ob_start(); ?>
    <?= _ws_image($image, ['objectFit' => true, 'objectFitPos' => $imageX && $imageY ? ($imageX * 100) . '% ' . ($imageY * 100) . '%' : false]); ?>
    <div class="card-body">
      <?= $content; ?>
    </div>
  <?php
  return _ws_block_wrapping($a, ob_get_clean(), 'div');
}
