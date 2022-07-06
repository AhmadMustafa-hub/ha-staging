<?php
class SVGPage extends OptionPage {

  function _ws_option_page() {
    ?>
    <div class="wrap options-page">
      <form action="options.php" method="post">
        <?php
        settings_fields('svg');
        do_settings_sections('svg'); ?>
        <div class="svg-options"></div>
      </form>
    </div>
    <?php
  }

}

new SVGPage('SVG Manager', [
  'slug' => 'svg',
  'fields' => ['svg']
]);
