<?php
function _ws_block_project_taxonomy($a) {
  $a['className'] = 'wp-block-ws-select-content ' . ($a['className'] ?? '');
  $horizontalScroll = isset($a['horizontalScroll']) && $a['horizontalScroll'] ? 'horizontal-scroll' : '';
  $ids = $a['ids'] ?? [];
  $type = get_post_type($ids[0]);
  ob_start(); ?>
<div class="row <?= $type; ?>-row <?= $horizontalScroll; ?>">
    <?php
      if (count($ids)) {
        global $post;
        foreach ($ids as $id) {
          $post = get_post($id);
          setup_postdata($post);
          get_template_part('parts/projects-tax', $type);
        }
        wp_reset_postdata();
      } ?>
</div>
<?php
  return _ws_block_wrapping($a, ob_get_clean(), 'div');
}