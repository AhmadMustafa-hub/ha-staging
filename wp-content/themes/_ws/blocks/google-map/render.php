<?php
function _ws_block_google_map($a) {
  $a['className'] = 'wp-block-ws-google-map ' . ($a['className'] ?? '');
  $address = $a['address'] ?? '';
  ob_start(); ?>
    <iframe class="google-map" width="600" height="450" frameborder="0" src="https://www.google.com/maps/embed/v1/place?key=<?= get_option('google_maps') ?: 'AIzaSyB5dOtdhz53nCEusX4aU4yRKkOGns_Dsn8'; ?>&q=<?= str_replace(' ', '+', strip_tags($address)); ?>" allowfullscreen></iframe>
  <?php
  return _ws_block_wrapping($a, ob_get_clean(), 'div');
}
