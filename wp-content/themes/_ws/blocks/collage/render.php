<?php
function _ws_block_collage($a, $content) {
  $a['className'] = 'wp-block-ws-collage ' . ($a['className'] ?? '');
  $image1 = $a['image1'] ?? '';
  $image2 = $a['image2'] ?? '';
  $image3 = $a['image3'] ?? '';
  $image4 = $a['image4'] ?? '';
  $image1Parallax = 'data-parallax-start="transform:translateY(-50px)" data-parallax-end="transform:translateY(50px)"';
  $image2Parallax = 'data-parallax-start="transform:translateY(50px)" data-parallax-end="transform:translateY(-50px)"';
  $image3Parallax = 'data-parallax-start="transform:translateY(-50px)" data-parallax-end="transform:translateY(50px)"';
  $image4Parallax = 'data-parallax-start="transform:translateY(50px)" data-parallax-end="transform:translateY(-50px)"';
  // if (strpos($a['className'], 'is-style-windows') !== false) {
  //   $image1Parallax = 'data-parallax-start="transform:translateY(-40px)" data-parallax-end="transform:translateY(10px)"';
  //   $image2Parallax = 'data-parallax-start="transform:translateY(-40px)" data-parallax-end="transform:translateY(10px)"';
  //   $image3Parallax = 'data-parallax-start="transform:translateY(40px)" data-parallax-end="transform:translateY(-10px)"';
  //   $image4Parallax = 'data-parallax-start="transform:translateY(40px)" data-parallax-end="transform:translateY(-10px)"';
  // }
  ob_start(); ?>
    <div class="row">
      <div class="col">
        <?= _ws_image($image1, ['class' => 'parallax image-1', 'attributes' => $image1Parallax]); ?>
      </div>
      <div class="col">
        <?= _ws_image($image2, ['class' => 'parallax image-2', 'attributes' => $image2Parallax]); ?>
      </div>
      <div class="col">
        <?= _ws_image($image3, ['class' => 'parallax image-3', 'attributes' => $image3Parallax]); ?>
      </div>
      <div class="col">
        <?= _ws_image($image4, ['class' => 'parallax image-4', 'attributes' => $image4Parallax]); ?>
      </div>
    </div>
  <?php
  return _ws_block_wrapping($a, ob_get_clean(), 'div');
}
