<?php
function _ws_block_select_content($a) {
  $a['className'] = 'wp-block-ws-select-content ' . ($a['className'] ?? '');
  $horizontalScroll = isset($a['horizontalScroll']) && $a['horizontalScroll'] ? 'horizontal-scroll' : '';
  $ids = $a['ids'] ?? [];
  $type = get_post_type($ids[0]);
  if (strpos($a['className'], 'is-style-cards') !== false) {
    $type = 'card';
  }
  if (strpos($a['className'], 'is-style-tiles') !== false) {
    $type = 'tile';
  }
  if (strpos($a['className'], 'is-style-list') !== false) {
    $type = 'list';
  }
  ob_start(); ?>
    <div class="row <?= $type; ?>-row <?= $horizontalScroll; ?>">
      <?php
      if (count($ids)) {
        global $post;
        foreach ($ids as $id) {
          $post = get_post($id);
          setup_postdata($post);
          get_template_part('parts/archive', $type);
        }
        wp_reset_postdata();
      } ?>
    </div>
  <?php
  return _ws_block_wrapping($a, ob_get_clean(), 'div');
}
