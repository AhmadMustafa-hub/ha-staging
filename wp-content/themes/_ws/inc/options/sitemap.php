<?php
class SitemapPage extends OptionPage {

  public function _ws_option_page() {
    ?>
    <div class="wrap options-page">
      <form action="options.php" method="post">
        <?php
        settings_fields('sitemap');
        do_settings_sections('sitemap'); ?>
        <div class="sitemap-options"></div>
      </form>
    </div>
    <?php
  }

}

new SitemapPage('Sitemap', [
  'fields' => [
    'last_mod',
    'sitemap_post_types'
  ]
]);

function _ws_sitemap() {
  $publics = get_post_types(['public'=>true]);
  unset($publics['attachment']);
  $ps = array_diff_key($publics, get_option('sitemap_post_types') ?: []);
  $postsForSitemap = get_posts([
    'post_type' => $ps,
    'order' => 'DESC',
    'orderby' => 'modified',
    'posts_per_page' => -1
  ]);
  $sitemap = '<?xml version="1.0" encoding="UTF-8"?>';
  $sitemap .= "\n" . '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
  foreach ($postsForSitemap as $post) {
    if (get_post_meta($post->ID, '_sitemap_remove', true) || get_post_meta($post->ID, '_link_external', true) || get_post_meta($post->ID, '_link_lightbox', true)) {
      continue;
    }
    $postdate = explode(" ", $post->post_modified);
    $freq = get_post_meta($post->ID, '_sitemap_freq', true) ?: 'monthly';
    $priority = get_post_meta($post->ID, '_sitemap_priority', true) ?: '0.5';
    $sitemap .= "\t" . '<url>' .
      "\n\t\t" . '<loc>' . get_permalink($post->ID) . '</loc>' .
      "\n\t\t" . '<lastmod>' . $postdate[0] . '</lastmod>' .
      "\n\t\t" . '<changefreq>' . $freq . '</changefreq>' .
      "\n\t\t" . '<priority>' . $priority . '</priority>' .
    "\n\t" . '</url>' . "\n";
  }
  $sitemap .= '</urlset>';
  $fp = fopen(ABSPATH . 'sitemap.xml', 'w');
  fwrite($fp, $sitemap);
  fclose($fp);
  update_option('last_mod', date("F j, Y g:i A"));
  return true;
}

function _ws_activate_sitemap_routine() {
  if (!wp_next_scheduled('_ws_sitemap_routine')) {
    wp_schedule_event(time(), 'daily', '_ws_sitemap_routine');
  }
}
add_action('after_setup_theme', '_ws_activate_sitemap_routine');
add_action('_ws_sitemap_routine', '_ws_sitemap');

function _ws_deactivate_sitemap_routine() {
  wp_clear_scheduled_hook('_ws_sitemap_routine');
}
add_action('switch_theme', '_ws_deactivate_sitemap_routine');
