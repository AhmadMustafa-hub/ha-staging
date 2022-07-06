<?php
class AMPPage extends OptionPage {

  public function __construct($name, $args) {
    parent::__construct($name, $args);
    add_action('init', [$this, '_ws_amp_rewrite']);
    add_filter('query_vars', [$this, '_ws_amp_query_var']);
    add_filter('template_include', [$this, '_ws_amp_template'], 99);
    add_action('wp_head', [$this, '_ws_amp_header']);
    add_action('wp_footer', [$this, '_ws_amp_footer']);
    add_filter('the_content', [$this, '_ws_amp_content']);
  }

  public function _ws_option_page() {
    ?>
    <div class="wrap options-page">
      <form action="options.php" method="post">
        <?php
        settings_fields('amp');
        do_settings_sections('amp'); ?>
        <div class="amp-options"></div>
      </form>
    </div>
    <?php
  }

  public function _ws_amp_rewrite() {
    add_rewrite_rule('^amp/(.*)/(.*)/?', 'index.php?post_type=$matches[1]&name=$matches[2]&amp=1', 'top');
  }

  public function _ws_amp_query_var($vars) {
    $vars[] = 'amp';
    return $vars;
  }

  public function _ws_amp_template($template) {
    if (get_query_var('amp')) {
      $template = locate_template(['parts/amp.php']);
    }
    return $template;
  }

  public function _ws_amp_header() {
    $output = '';
    if (get_query_var('amp')) {
      $output .= '<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>';
      $output .= '
      <style amp-custom>' .
        preg_replace(
          [
            '/@import.*fonts\.googleapis\.com(.*?);/',
            '/ !important/'
          ],
          [
            '',
            ''
          ],
          file_get_contents(get_template_directory() . '/dist/css/front/wp.min.css')
        ) . '.page-header,.archive-header,.single-header{' . rtrim(_ws_thumbnail_background(), ';') . '}
      </style>';
      if (get_option('google_analytics_id')) {
        $output .= '<script async custom-element="amp-analytics" src="https://cdn.ampproject.org/v0/amp-analytics-0.1.js"></script>';
      }
    }
    echo $output;
  }

  public function _ws_amp_footer() {
    $output = '';
    if (get_query_var('amp') && get_option('google_analytics_id')) {
      $output .= '
      <amp-analytics type="googleanalytics">
        <script type="application/json">
          {
            "vars": {
              "account": "' . get_option('google_analytics_id') . '"
            },
            "triggers": {
              "trackPageview": {
                "on": "visible",
                "request": "pageview"
              }' .
              (get_option('amp_triggers') ? ', ' . get_option('amp_triggers') : '') . '
            }
          }
        </script>
      </amp-analytics>';
    }
    echo $output;
  }

  public function _ws_amp_content($content) {
    if (get_query_var('amp')) {
      $content = preg_replace(
        ['/(<img )(.+)(>)/', '/style=\".*\"/'],
        ['<amp-img layout="responsive" $2</amp-img>', ''],
        $content
      );
    }
    return $content;
  }

}

global $ws_config;
if ($ws_config['amp']) {
  new AMPPage('AMP', [
    'fields' => [
      'amp',
      'amp_triggers'
    ]
  ]);
}
