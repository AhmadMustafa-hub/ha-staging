<?php
function _ws_block_big_card($a, $content) {
  $a['className'] = 'wp-block-ws-big-card card-link ' . ($a['className'] ?? '');
  $image = $a['image'] ?? '';
  $imageX = $a['imageX'] ?? '';
  $imageY = $a['imageY'] ?? '';
  $heading = $a['heading'] ?? '';
  $text = $a['text'] ?? '';
  $link = $a['link'] ?? ['url' => '', 'opensInNewTab' => false];
  ob_start(); ?>
    <?= _ws_image($image, ['objectFit' => true, 'objectFitPos' => $imageX && $imageY ? ($imageX * 100) . '% ' . ($imageY * 100) . '%' : false, 'class' => 'parallax-bg card-image']); ?>
    <div class="card-body">
      <?php
      if ($heading) {
        echo $link['url'] ? ('<h3><a href="' . $link['url'] . '" ' . ($link['opensInNewTab'] ? 'target="_blank" rel="noopener"' : '') . '>' . $heading . '</a>[svg id="caret-right" class="has-moss-color"]</h3>') : '<h3>' . $heading . '[svg id="caret-right" class="has-moss-color"]</h3>';
      }
      echo $text ? '<p>' . $text . '</p>' : ''; ?>
    </div>
  <?php
  return _ws_block_wrapping($a, ob_get_clean(), 'div');
}
