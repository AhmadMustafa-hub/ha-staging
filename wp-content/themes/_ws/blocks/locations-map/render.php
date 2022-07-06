<?php
function _ws_block_locations_map($a) {
  $a['className'] = 'wp-block-ws-locations-map ' . ($a['className'] ?? '');
  $stateAbbreviations = [
    'AL' => 'Alabama',
    'AK' => 'Alaska',
    'AS' => 'American Samoa',
    'AZ' => 'Arizona',
    'AR' => 'Arkansas',
    'CA' => 'California',
    'CO' => 'Colorado',
    'CT' => 'Connecticut',
    'DE' => 'Delaware',
    'DC' => 'District of Columbia',
    'FM' => 'States of Micronesia',
    'FL' => 'Florida',
    'GA' => 'Georgia',
    'GU' => 'Guam',
    'HI' => 'Hawaii',
    'ID' => 'Idaho',
    'IL' => 'Illinois',
    'IN' => 'Indiana',
    'IA' => 'Iowa',
    'KS' => 'Kansas',
    'KY' => 'Kentucky',
    'LA' => 'Louisiana',
    'ME' => 'Maine',
    'MH' => 'Marshall Islands',
    'MD' => 'Maryland',
    'MA' => 'Massachusetts',
    'MI' => 'Michigan',
    'MN' => 'Minnesota',
    'MS' => 'Mississippi',
    'MO' => 'Missouri',
    'MT' => 'Montana',
    'NE' => 'Nebraska',
    'NV' => 'Nevada',
    'NH' => 'New Hampshire',
    'NJ' => 'New Jersey',
    'NM' => 'New Mexico',
    'NY' => 'New York',
    'NC' => 'North Carolina',
    'ND' => 'North Dakota',
    'MP' => 'Northern Mariana Islands',
    'OH' => 'Ohio',
    'OK' => 'Oklahoma',
    'OR' => 'Oregon',
    'PW' => 'Palau',
    'PA' => 'Pennsilvania',
    'PR' => 'Puerto Rico',
    'RI' => 'Rhode Island',
    'SC' => 'South Carolina',
    'SD' => 'South Dakota',
    'TN' => 'Tennessee',
    'TX' => 'Texas',
    'UT' => 'Utah',
    'VT' => 'Vermont',
    'VI' => 'Virgin Islands',
    'VA' => 'Virginia',
    'WA' => 'Washington',
    'WV' => 'West Virginia',
    'WI' => 'Wisconsin',
    'WY' => 'Wyoming'
  ];
  $locations = get_posts([
    'post_type' => 'location',
    'meta_query' => [
      'relation' => 'AND',
      'state' => [
        'key' => '_location_state',
        'compare' => 'EXISTS'
      ],
      'city' => [
        'key' => '_location_city',
        'compare' => 'EXISTS'
      ]
    ],
    // 'orderby' => 'meta_value',
    'orderby' => [
      'state' => 'ASC',
      'city' => 'ASC'
    ],
    // 'meta_key' => '_location_city',
    'post_status' => 'publish',
    'posts_per_page' => -1
  ]);
  $output = [];
  foreach ($locations as $location) {
    $name = get_post_meta($location->ID, '_location_name', true);
    $address = get_post_meta($location->ID, '_location_address', true);
    $city = get_post_meta($location->ID, '_location_city', true);
    $displayCity = get_post_meta($location->ID, '_location_display_city', true);
    $state = get_post_meta($location->ID, '_location_state', true);
    $zip = get_post_meta($location->ID, '_location_zip', true);
    $coordinates = get_post_meta($location->ID, '_location_coordinates', true);
    $phones = explode(',', get_post_meta($location->ID, '_location_phones', true));
    $phones = array_map(function($phone) {
      preg_match('/\d+-\d+-\d+-\d+|\d+-\d+-\d+/', $phone, $number);
      if (count($number)) {
        return '<a href="tel:' . $number[0] . '">' . $phone . '</a>';
      }
      return $phone;
    }, $phones);
    array_push($output, [
      'name' => $name,
      'address' => $address,
      'city' => $city,
      'displayCity' => $displayCity,
      'state' => $state,
      'zip' => $zip,
      'coordinates' => $coordinates,
      'phones' => $phones
    ]);
  }
  ob_start(); ?>
    <div class="relative">
      <div class="locations-map" data-locations="<?= rawurlencode(json_encode($output)); ?>"></div>
      <div class="container-fluid form">
        <form autocomplete="off">
          <label for="map-search" class="screen-reader-text">Search by ZIP, City or State</label>
          <div class="relative">
            <input id="map-search" name="map-search" type="text" placeholder="Search by ZIP, City or State" />
            <div class="results"></div>
          </div>
        </form>
      </div>
    </div>
    <section class="ws-block-section padding-top--50">
      <div class="container section-container">
        <?php
        $accordions = '';
        $states = [];
        foreach ($output as $location) {
          if (isset($states[$location['state']])) {
            array_push($states[$location['state']], $location);
          }
          else {
            $states[$location['state']] = [$location];
          }
        }
        uksort($states, function($a, $b) use ($stateAbbreviations) {
          if ($stateAbbreviations[$a] === $stateAbbreviations[$b]) {
            return 0;
          }
          return $stateAbbreviations[$a] < $stateAbbreviations[$b] ? -1 : 1;
        });
        foreach ($states as $key=>$state) {
          $stateText = '';
          foreach ($state as $location) {
            $locationText = $location['address'] . '<br />' . $location['city'] . ', ' . $location['state'] . ' ' . $location['zip'];
            $stateText .= '<div class="col-md-6 col-lg-4"><p><b>' . ($location['displayCity'] ?: $location['city']) . '</b></p><p>' . ($location['name'] ? $location['name'] . '<br />' : '') . $locationText . '<br />' . implode('<br />', $location['phones']) . '<br /><a class="button-simple" href="https://www.google.com/maps/dir/?api=1&destination=' . urlencode(str_replace('<br />', ', ', $locationText)) . '" target="_blank" rel="noopener">Get Directions</a></div>';
          }
          $accordions .= _ws_block_accordion(['heading' => $stateAbbreviations[$key]], '<div class="row">' . $stateText . '</div>');
        }
        echo _ws_block_side_attached(['backgroundColor' => 'white'], '<h1>Our locations</h1>' . $accordions); ?>
      </div>
    </section>
    <?php
  return _ws_block_wrapping($a, ob_get_clean(), 'div');
}
