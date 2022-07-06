<?php
class CachingPage extends OptionPage {

  public function __construct($name, $args) {
    parent::__construct($name, $args);
    add_action('update_option_cache', [$this, '_ws_update_caching'], 10, 2);
  }

  public function _ws_option_page() {
    ?>
    <div class="wrap options-page">
      <form action="options.php" method="post">
        <?php
        settings_fields($this->slug);
        do_settings_sections($this->slug);?>
        <?php
        if (!wp_is_writable(get_home_path() . '.htaccess')) {
          echo '<div class="warning">Your .htaccess file needs to be writable for these options to have any affect.</div>';
        } ?>
        <div class="caching-options <?= !wp_is_writable(get_home_path() . '.htaccess') ? 'disabled' : ''; ?>"></div>
      </form>
    </div>
    <?php
  }

  // Write caching rules to .htaccess
  function _ws_update_caching($old, $new) {
    $caching = '<IfModule mod_headers.c>
      Header set Connection keep-alive
      # Media
      <filesmatch "\.(eot|woff|otf|ttf|jpg|jpeg|png|gif|tiff|bmp|ico|svg)$">
        Header set Cache-Control "max-age=' . ($new['media'] ?: '604800') . ', public"
      </filesmatch>
      # CSS
      <filesmatch "\.(css)$">
        Header set Cache-Control "max-age=' . ($new['css'] ?: '86400') . ', public"
      </filesmatch>
      # JS
      <filesmatch "\.(js)$">
        Header set Cache-Control "max-age=' . ($new['js'] ?: '86400') . ', public"
      </filesmatch>
      # HTML
      <filesMatch "\.(x?html?|php)$">
        Header set Cache-Control "max-age=' . ($new['html'] ?: '86400') . ', public"
      </filesMatch>
    </IfModule>';
    insert_with_markers(get_home_path() . '.htaccess', 'Caching', $caching);
  }

}

global $ws_config;
if ($ws_config['caching']) {
  new CachingPage('Caching', [
    'fields' => ['cache']
  ]);
}
