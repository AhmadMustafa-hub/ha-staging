<?php
function _ws_page_template() {
  $post_type_object = get_post_type_object('page');
  $post_type_object->template = [
    ['ws/section', [], [
      ['ws/split', [], [
        ['ws/split-half', [], [
          ['ws/page-title']
        ]],
        ['ws/split-half']
      ]]
    ]]
  ];
}
add_action('init', '_ws_page_template');

new Taxonomy('Page Type', [
  'post_types' => ['page'],
  'description' => 'Taxonomy for pages.'
]);
