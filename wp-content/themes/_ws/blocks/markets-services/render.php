<?php
function _ws_block_markets_services($a, $content) {
  $a['className'] = 'wp-block-ws-markets-services ' . ($a['className'] ?? '');
  $marketsId = get_page_by_path('markets');
  $servicesId = get_page_by_path('services');
  ob_start(); ?>
    <div class="row">
      <div class="col-md-10 col-lg-8 col-xl-6">
        <div class="card-link markets">
          <h3 class="post-title"><?= get_the_title($marketsId); ?></h3>
          <?= has_excerpt($marketsId) ? '<p class="post-excerpt">' . get_the_excerpt($marketsId) . '</p>' : ''; ?>
          <a class="button-simple" href="<?= get_permalink($marketsId); ?>">View all Markets</a>
        </div>
        <div <?= _ws_thumbnail_background($marketsId, ['class' => 'parallax-bg image', 'size' => 'full']); ?>></div>
        <div class="card-link services">
          <h3 class="post-title"><?= get_the_title($servicesId); ?></h3>
          <?= has_excerpt($servicesId) ? '<p class="post-excerpt">' . get_the_excerpt($servicesId) . '</p>' : ''; ?>
          <a class="button-simple" href="<?= get_permalink($servicesId); ?>">View all Services</a>
        </div>
        <div <?= _ws_thumbnail_background($servicesId, ['class' => 'parallax-bg image', 'size' => 'full']); ?>></div>
      </div>
    </div>
  <?php
  return _ws_block_wrapping($a, ob_get_clean(), 'div');
}
