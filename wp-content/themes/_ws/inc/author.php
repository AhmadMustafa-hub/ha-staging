<?php
// Custom author
function _ws_custom_author($author) {
  global $post;
  return get_post_meta($post->ID, '_author_name', true) ?: $author;
}
add_filter('the_author', '_ws_custom_author');

// Custom avatar
function _ws_custom_avatar_field() {
  ?>
  <div class="author-options"></div>
  <?php
}
add_action('show_user_profile', '_ws_custom_avatar_field');
add_action('edit_user_profile', '_ws_custom_avatar_field');

// Save custom avatar
function _ws_save_custom_avatar_field($user_id) {
  if (!current_user_can('edit_user', $user_id)) {
    return false;
  }
  update_user_meta($user_id, 'custom_avatar', $_POST['custom_avatar']);
}
add_action('personal_options_update', '_ws_save_custom_avatar_field');
add_action('edit_user_profile_update', '_ws_save_custom_avatar_field');

// Add custom avatar field
function _ws_custom_avatar($avatar) {
  $custom_avatar = get_the_author_meta('custom_avatar');
  $custom_avatar = get_post_meta(get_the_ID(), '_author_image', true) ?: $custom_avatar;
  if ($custom_avatar) {
    return wp_get_attachment_image_src($custom_avatar, 'thumbnail')[0];
  }
  return $avatar;
}
add_filter('get_avatar_url', '_ws_custom_avatar');
