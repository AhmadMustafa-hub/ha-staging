<?php
class BulkEditPage extends OptionPage {

  public function _ws_option_page() {
    ?>
    <div class="wrap options-page">
      <form action="options.php" method="post">
        <div class="bulk-edit-options"></div>
      </form>
    </div>
    <?php
  }

}

global $ws_config;
if ($ws_config['bulk']) {
  new BulkEditPage('Bulk Edit', [
    'slug' => 'bulk',
    'menu' => 'tools'
  ]);
}
