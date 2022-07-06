<?php
function _ws_block_featured_post($a, $content) {
  $a['className'] = 'wp-block-featured-post ' . ($a['className'] ?? '');
  $postId = $a['postId'] ?? 0;
  ob_start();
    if ($postId) : ?>
      <h3 class="featured-heading"><?= __('Featured Resource', '_ws'); ?></h3>
      <div class="card-link archive-view archive-default archive-project">
        <div class="row">
          <div class="col-md-6 left-side">
            <?php
            if (has_post_thumbnail($postId)) {
              echo _ws_thumbnail($postId, ['objectFit' => true, 'class' => 'parallax-bg featured-image']);
            }
            else {
              echo '<div class="parallax-background"><div class="archive-image archive-placeholder"><img src="' .  _ws_logo(true) . '" alt="' . get_bloginfo('name') . '" /></div></div>';
            } ?>
          </div>
          <div class="col-md-6 right-side">
            <?php
            $subhead = _ws_get_post_type_label($postId);
            $company = get_post_meta($postId, '_project_company', true);
            $location = get_post_meta($postId, '_project_location', true);
            if ($company || $location) {
              $subhead = implode('&nbsp;&middot;&nbsp;', array_filter([$company, $location]));
            } ?>
            <p class="subhead no-margin"><?= $subhead; ?></p>
            <div class="title-excerpt">
              <h3 class="post-title"><?= _ws_get_link($postId); ?></h3>
              <?= has_excerpt($postId) ? '<p class="post-excerpt">' . get_the_excerpt($postId) . '</p>' : ''; ?>
            </div>
            <p class="button-simple"><?= __('View', '_ws') . ' ' . _ws_get_post_type_label($postId); ?></p>
          </div>
        </div>
      </div>
      <?php
    endif;
  return _ws_block_wrapping($a, ob_get_clean(), 'div');
}
