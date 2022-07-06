<?php
class LocationMeta extends PostMeta {

}

new LocationMeta('Location', [
  'template' => [
    ['ws/meta-location']
  ],
  'template_lock' => 'all',
  'dashicon' => 'dashicons-location-alt',
  'url' => 'locations',
  'public' => false
]);
