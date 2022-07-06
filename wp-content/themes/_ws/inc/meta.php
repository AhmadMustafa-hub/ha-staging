<?php
function _ws_register_meta() {
  $metas = [
    // '_header_footer_light_header' => 'boolean',
    '_header_footer_hide_header' => 'boolean',
    '_header_footer_hide_footer' => 'boolean',
    '_seo_title' => 'string',
    '_seo_description' => 'string',
    '_seo_keywords' => 'string',
    '_seo_canonical' => 'string',
    '_seo_no_index' => 'boolean',
    '_seo_no_follow' => 'boolean',
    '_seo_disallow_search' => 'boolean',
    '_social_title' => 'string',
    '_social_description' => 'string',
    '_social_image' => 'integer',
    '_social_twitter' => 'string',
    '_sitemap_freq' => 'string',
    '_sitemap_priority' => 'string',
    '_sitemap_remove' => 'boolean',
    '_link_external' => 'string',
    '_link_lightbox' => 'string',
    '_featured_image_x' => 'string',
    '_featured_image_y' => 'string',
    '_authors' => 'string',
    // '_authors_custom' => 'string',
    // '_event_start_date' => 'string',
    // '_event_has_start_time' => 'boolean',
    // '_event_end_date' => 'string',
    // '_event_has_end_time' => 'boolean',
    // '_event_date_tbd' => 'boolean',
    // '_event_has_location' => 'boolean',
    // '_event_location_name' => 'string',
    // '_event_location_street' => 'string',
    // '_event_location_city' => 'string',
    // '_event_location_state' => 'string',
    // '_event_location_zip' => 'string',
    // '_event_location_override' => 'string',
    '_location_name' => 'string',
    '_location_address' => 'string',
    '_location_city' => 'string',
    '_location_display_city' => 'string',
    '_location_state' => 'string',
    '_location_zip' => 'string',
    '_location_coordinates' => 'string',
    '_location_phones' => 'string',
    '_person_suffixes' => 'string',
    '_person_position' => 'string',
    '_person_linkedin' => 'string',
    '_person_email' => 'string',
    '_person_twitter' => 'string',
    '_person_google_scholar' => 'string',
    '_person_resources' => 'array',
    '_project_company' => 'string',
    '_project_location' => 'string',
    '_project_kpi_1' => 'string',
    '_project_kpi_description_1' => 'string',
    '_project_kpi_2' => 'string',
    '_project_kpi_description_2' => 'string',
    '_project_kpi_3' => 'string',
    '_project_kpi_description_3' => 'string'
  ];

  foreach ($metas as $meta=>$type) {
    $schema = [
      'schema' => [
        'type'  => 'array',
        'items' => [
          'type' => 'integer'
        ]
      ]
    ];
    register_meta('post', $meta, [
      'show_in_rest' => $type === 'array' ? $schema : true,
      'single' => true,
      'type' => $type,
      'auth_callback' => function() {
        return current_user_can('edit_posts');
      }
    ]);
  }
}
add_action('init', '_ws_register_meta');
