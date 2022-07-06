<?php
function _ws_404_external_pages() {
  global $post;
  if ($post && is_singular() && (get_post_meta($post->ID, '_link_external', true) || get_post_meta($post->ID, '_link_lightbox', true))) {
    global $wp_query;
    $wp_query->set_404();
    status_header(404);
  }
}
add_action('wp', '_ws_404_external_pages');

function _ws_external_link($url, $post) {
  $redirect = get_post_meta($post->ID, '_link_external', true);
  if ($redirect) {
    return $redirect;
  }
  return $url;
}
add_filter('post_type_link', '_ws_external_link', 10, 2);
add_filter('post_link', '_ws_external_link', 10, 2);

// Exclude pages from internal search
function _ws_search_filter($query) {
  if ($query->is_search) {
    $posts_array = get_posts([
      'post_type' => get_post_types(),
      'meta_key' => '_seo_disallow_search',
      'meta_value' => true,
      'posts_per_page' => -1
    ]);
    $post_ids = array_column($posts_array, 'ID');
    $query->set('post__not_in', $post_ids);
  }
  return $query;
}
add_action('pre_get_posts', '_ws_search_filter');
