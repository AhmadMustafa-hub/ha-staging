<?php
function _ws_block_children($a) {
  $a['className'] = 'wp-block-ws-children ' . ($a['className'] ?? '');
  $parent = $a['parent'] ?? get_the_ID();
  $numPosts = $a['numPosts'] ?? 3;
  $numPosts = isset($a['allPosts']) && $a['allPosts'] ? -1 : $numPosts;
  $type = get_post_type($parent);
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
    <div class="row <?= $type; ?>-row">
      <?php
      $ps = get_posts([
        'post_type' => 'any',
        'posts_per_page' => $numPosts,
        'post_status' => 'publish',
        'post_parent' => $parent,
        'orderby' => 'menu_order',
        'order' => 'ASC'
      ]);
      global $post;
      foreach ($ps as $post) {
        setup_postdata($post);
        get_template_part('parts/archive', $type);
      }
      wp_reset_postdata(); ?>
    </div>
  <?php
  return _ws_block_wrapping($a, ob_get_clean(), 'div');
}
