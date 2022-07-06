<?php
// Register scripts/styles
function _ws_register_scripts() {
  $dist = get_template_directory() . '/dist/assets.json';
  $manifest = file_exists($dist) ? json_decode(file_get_contents($dist, true)) : false;
  if ($manifest) {
    // CSS
    wp_register_style(
      'font-css',
      'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap'
    );
    wp_register_style(
      'front-css',
      get_template_directory_uri() . '/dist/' . $manifest->{'front-css'}->css,
      [],
      null
    );
    wp_register_style(
      'admin-css',
      get_template_directory_uri() . '/dist/' . $manifest->{'admin-css'}->css,
      [],
      null
    );
    // JS
    wp_register_script(
      'google-charts',
      'https://www.gstatic.com/charts/loader.js',
      [],
      null
    );
    wp_register_script(
      'amp',
      'https://cdn.ampproject.org/v0.js',
      [],
      null
    );
    // wp_register_script(
    //   'lottie-js',
    //   'https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.5.9/lottie.min.js',
    //   [],
    //   null
    // );
    wp_register_script(
      'front-js',
      get_template_directory_uri() . '/dist/' . $manifest->{'front-js'}->js,
      [],
      null
    );
    wp_register_script(
      'google-maps',
      'https://maps.googleapis.com/maps/api/js?key=' . (get_option('google_maps') ?: 'AIzaSyB5dOtdhz53nCEusX4aU4yRKkOGns_Dsn8') . '&callback=initMap',
      ['front-js']
    );
    wp_register_script(
      'calc-js',
      get_template_directory_uri() . '/dist/' . $manifest->{'calc-js'}->js,
      ['google-charts'],
      null
    );
    wp_register_script(
      'options-js',
      get_template_directory_uri() . '/dist/' . $manifest->{'options-js'}->js,
      ['wp-blocks', 'wp-components', 'wp-editor', 'wp-element', 'wp-edit-post'],
      null,
      true
    );
    wp_register_script(
      'blocks-js',
      get_template_directory_uri() . '/dist/' . $manifest->{'blocks-js'}->js,
      ['wp-blocks', 'wp-element', 'wp-hooks'],
      null,
      true
    );
  }
}
add_action('wp_loaded', '_ws_register_scripts');

// Make frontend javascript defer and remove type attribute
function _ws_script_attribute($tag, $handle) {
  $tag = str_replace(' type=\'text/javascript\'', '', $tag);
  if ($handle === 'front-js' || $handle === 'calc-js' || $handle === 'google-maps') {
    return str_replace(' src', ' defer src', $tag);
  }
  if ($handle === 'amp' || $handle === 'amp-analytics') {
    return str_replace(' src', ' async src', $tag);
  }
  return $tag;
}
add_filter('script_loader_tag', '_ws_script_attribute', 10, 2);

// Remove stylesheet type attribute
function _ws_style_attribute($tag) {
  $tag = str_replace(' type=\'text/css\'', '', $tag);
  return $tag;
}
add_filter('style_loader_tag', '_ws_style_attribute', 10, 2);

// Enqueue frontend scripts/styles
function _ws_wp_enqueue() {
  wp_deregister_script('wp-embed'); // Remove embed script

  global $post;
  global $post_type;
  wp_enqueue_style('font-css');
  wp_enqueue_style('front-css');
  if (get_query_var('amp')) {
    wp_enqueue_script('amp');
  }
  else {
    wp_enqueue_script('front-js');
    if ($post && strpos($post->post_content, 'wp:ws/calculator') !== false) {
      wp_enqueue_script('calc-js');
    }
  }
  if ($post && strpos($post->post_content, '<!-- wp:ws/locations-map') !== false) {
    wp_enqueue_script('google-maps');
  }
}
add_action('wp_enqueue_scripts', '_ws_wp_enqueue');

// Enqueue admin scripts/styles
function _ws_admin_enqueue($hook) {
  global $post_type;
  wp_enqueue_style('admin-css');
  wp_localize_script('blocks-js', 'locals', [
    'postType' => $post_type,
    'seoMetaTitle' => get_option('seo_meta_title'),
    'svgs' => get_option('svg') ?: [],
    'postsPerPage' => get_option('posts_per_page'),
    'googleMaps' => get_option('google_maps') ?: 'AIzaSyB5dOtdhz53nCEusX4aU4yRKkOGns_Dsn8'
  ]);
  if (in_array($hook, ['settings_page_analytics', 'settings_page_redirects', 'settings_page_site_options', 'settings_page_sitemap', 'settings_page_svg', 'tools_page_bulk', 'profile.php', 'user-edit.php', 'nav-menus.php'])) {
    wp_enqueue_style('wp-edit-blocks');
    global $colors;
    wp_localize_script('options-js', 'locals', [
      'ajax_url' => admin_url('admin-ajax.php'),
      'colors' => $colors,
      'svgs' => get_option('svg') ?: [],
      'redirects' => get_option('redirects') ?: [],
      'ampPostTypes' => get_option('amp') ?: [],
      'ampTriggers' => get_option('amp_triggers'),
      'sitemapPostTypes' => get_option('sitemap_post_types') ?: [],
      'lastMod' => get_option('last_mod'),
      'logo' => _ws_logo(),
      'googleMaps' => get_option('google_maps'),
      'disableComments' => get_option('disable_comments'),
      'bannerText' => get_option('banner_text'),
      'bannerUID' => get_option('banner_uid'),
      'seoMetaTitle' => get_option('seo_meta_title'),
      'sitePhone' => get_option('site_phone'),
      'siteEmail' => get_option('site_email'),
      'siteLocationStreet' => get_option('site_location_street'),
      'siteLocationCity' => get_option('site_location_city'),
      'siteLocationState' => get_option('site_location_state'),
      'siteLocationZip' => get_option('site_location_zip'),
      'socialLinks' => get_option('social_links'),
      'tagManagerId' => get_option('tag_manager_id'),
      'pardotEmail' => get_option('pardot_email'),
      'pardotPassword' => get_option('pardot_password'),
      'pardotKey' => get_option('pardot_key'),
      'pardotAccount' => get_option('pardot_account'),
      'marketoEndpoint' => get_option('marketo_endpoint'),
      'marketoToken' => get_option('marketo_token'),
      'pwa' => get_option('pwa'),
      'cache' => get_option('cache'),
      'customAvatar' => get_the_author_meta('custom_avatar', $_GET['user_id'] ?? get_current_user_id())
    ]);
    wp_enqueue_script('options-js');
  }
}
add_action('admin_enqueue_scripts', '_ws_admin_enqueue');

// Prefetch and preconnect unregistered scripts
function _ws_prefetch() {
  global $post;
  if ($post) :
    if (strpos($post->post_content, '<!-- wp:ws/form') !== false) : ?>
      <link rel="preconnect" href="https://js.hsforms.net/" />
      <link rel="dns-prefetch" href="https://js.hsforms.net/" />
      <?php
    endif;
    if (get_option('tag_manager_id')) : ?>
      <link rel="preconnect" href="https://www.googletagmanager.com" />
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      <?php
    endif;
  endif; ?>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <!-- font dns-prefetch handled by registration -->
  <?php
}
add_action('wp_head', '_ws_prefetch', 1);
