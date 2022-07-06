<aside class="sidebar widget-area col-sm-4 <?= is_page_template('templates/sidebar-right.php') ? 'col-sm-offset-1' : '' ?> col-xs-12" role="complementary">
  <ul class="sidebar-widgets">
    <?php
    if (is_active_sidebar('sidebar')) {
      dynamic_sidebar('sidebar');
    }
    else {
      echo '<li>Add a widget to the sidebar via the admin panel: <i>Appearance->Widgets</i></li>';
    } ?>
  </ul>
</aside>
