<?php
class RedirectsPage extends OptionPage {

  public function __construct($name, $args) {
    parent::__construct($name, $args);
    add_action('update_option_redirects', [$this, '_ws_update_redirects'], 10, 2);
  }

  public function _ws_option_page() {
    ?>
    <div class="wrap options-page">
      <form action="options.php" method="post">
        <?php
        settings_fields('redirects');
        do_settings_sections('redirects');
        if (!wp_is_writable(get_home_path() . '.htaccess')) {
          echo '<div class="warning">Your .htaccess file needs to be writable for these options to have any affect.</div>';
        } ?>
        <div class="redirect-options <?= !wp_is_writable(get_home_path() . '.htaccess') ? 'disabled' : ''; ?>"></div>
      </form>
    </div>
    <?php
  }

  function _ws_update_redirects($old, $new) {
    $redirects = '';
    if ($new) {
      foreach ($new as $redirect) {
        $redirects .= 'Redirect 301 "' . $redirect['old'] . '" "' . $redirect['new'] . '"' . "\n";
      }
    }
    $redirects = substr($redirects, 0, -1);
    insert_with_markers(get_home_path() . '.htaccess', 'Redirects', $redirects);
  }

}

global $ws_config;
if ($ws_config['redirects']) {
  new RedirectsPage('301 Redirects', [
    'slug' => 'redirects',
    'fields' => ['redirects']
  ]);
}
