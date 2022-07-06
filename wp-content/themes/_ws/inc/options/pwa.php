<?php
class PWAPage extends OptionPage {

  public function __construct($name, $args) {
    parent::__construct($name, $args);
    add_action('init', [$this, '_ws_offline_rewrite']);
    add_filter('query_vars', [$this, '_ws_offline_query_var']);
    add_filter('template_include', [$this, '_ws_offline_template'], 99);
    add_filter('update_option_pwa', [$this, '_ws_update_pwa'], 10, 2);
  }

  public function _ws_option_page() {
    ?>
    <div class="wrap options-page">
      <form action="options.php" method="post">
        <?php
        settings_fields('pwa');
        do_settings_sections('pwa'); ?>
        <div class="pwa-options"></div>
      </form>
    </div>
    <?php
  }

  public function _ws_update_pwa($old, $new) {
    $filename = get_home_path() . '/manifest.json';
    $handle = fopen($filename, 'w');
    $output = '{
  "short_name": "' . $new['short_name'] . '",
  "name": "' . $new['name'] . '",
  "icons": [
    {
      "src": "' . get_the_post_thumbnail_url($new['icon_small'], 'full') . '",
      "type": "' . get_post_mime_type($new['icon_small']) . '",
      "sizes": "192x192"
    },
    {
      "src": "' . get_the_post_thumbnail_url($new['icon_large'], 'full') . '",
      "type": "' . get_post_mime_type($new['icon_large']) . '",
      "sizes": "512x512"
    }
  ],
  "start_url": "/",
  "background_color": "' . $new['background_color'] . '",
  "display": "standalone",
  "orientation": "any",
  "scope": "/",
  "theme_color": "#3367D6"
}';
    $file = fwrite($handle, $output);
    fclose($handle);
  }

  public function _ws_offline_rewrite() {
    add_rewrite_rule('^offline/?', 'index.php?offline=1', 'top');
    add_rewrite_rule('^404/?', 'index.php?404=1', 'top');
  }

  public function _ws_offline_query_var($vars) {
    $vars[] = 'offline';
    $vars[] = '404';
    return $vars;
  }

  public function _ws_offline_template($template) {
    if (get_query_var('offline')) {
      $template = locate_template(['offline.php']);
    }
    if (get_query_var('404')) {
      $template = locate_template(['404.php']);
    }
    return $template;
  }

}

global $ws_config;
if ($ws_config['pwa']) {
  new PWAPage('PWA', [
    'fields' => ['pwa']
  ]);
}
