<?php
function _ws_get_post_type_label($id = null) {
  if (!$id) {
    global $post;
    if ($post) {
      $id = $post->ID;
    }
    else {
      return;
    }
  }
  $type = get_post_type($id);
  $output = get_post_type_object($type)->labels->singular_name;
  if ($type === 'post') {
  // $output = 'Blog Post';
     $output = 'Article';
  }
  else if ($type === 'person') {
    $output = 'Leadership';
  }
  return $output;
}

// Get the post link with external/lightbox code if needed
function _ws_get_link($id = null, $options = []) {
  if (!$id) {
    global $post;
    if ($post) {
      $id = $post->ID;
    }
    else {
      return;
    }
  }
  $class = isset($options['class']) ? 'class="' . $options['class'] . '"' : '';
  $lightbox = get_post_meta($id, '_link_lightbox', true);
  $external = get_post_meta($id, '_link_external', true);
  $output = '';
  if ($lightbox) {
    $output = do_shortcode('[lightbox ' . $class . ' text="' . ($options['title'] ?? get_the_title($id)) . '" url="' . $lightbox . '"]');
  }
  else {
    $output = '<a ' . $class . ' ' . ($external ? 'target="_blank" rel="noopener noreferrer" ' : '') . 'href="' . get_permalink($id) . '">' . ($options['title'] ?? get_the_title($id)) . '</a>';
  }
  return $output;
}

// Get links to previous and next posts
function _ws_get_prev_next() {
  ob_start();
  if (get_next_post() || get_previous_post()) : ?>
    <div class="prev-next">
      <div class="left-link">
        <?= get_previous_post() ? '<div class="card card-link"><p class="subhead">Previous</p><a href="' . get_permalink(get_previous_post()->ID) . '" rel="prev">' . get_the_title(get_previous_post()->ID) . '</a></div>' : ''; ?>
      </div>
      <div class="right-link has-text-align-right">
        <?= get_next_post() ? '<div class="card card-link"><p class="subhead">Next</p><a href="' . get_permalink(get_next_post()->ID) . '" rel="next">' . get_the_title(get_next_post()->ID) . '</a></div>' : ''; ?>
      </div>
    </div>
    <?php
  endif;
  return ob_get_clean();
}

// Convert global color hex to slug name
function _ws_get_color_slug($hex) {
  global $colors;
  $slug = '';
  foreach ($colors as $c) {
    if ($c['color'] === $hex) {
      $slug = $c['slug'];
    }
  }
  return $slug;
}

// Get featured image for images
function _ws_thumbnail($id = null, $options = []) {
  if (!$id) {
    global $post;
    if ($post) {
      $id = $post->ID;
    }
    else {
      return;
    }
  }
  if (!has_post_thumbnail($id)) {
    return;
  }
  $class = $options['class'] ?? '';
  $objectFit = $options['objectFit'] ?? false;
  $objectFitPos = $options['objectFitPos'] ?? false;
  $size = $options['size'] ?? 'large';
  $lazy = $options['lazy'] ?? true;
  $alt = get_post_meta(get_post_thumbnail_id($id), '_wp_attachment_image_alt', true);
  $output = '';
  $x = get_post_meta($id, '_featured_image_x', true);
  $y = get_post_meta($id, '_featured_image_y', true);
  $xy = $x !== '' && $y !== '' ?  ($x * 100) . '% ' . ($y * 100) . '%' : '';
  $xy = $objectFitPos ?: $xy;
  $output = '<img ';
  $output .= !$lazy ? 'class="no-lazy ' . (!$objectFit ? $class : '') . '" ' : 'class="' . (!$objectFit ? $class : '') . '" ';
  $output .= 'src="' . get_the_post_thumbnail_url($id, $size) . '" ';
  $output .= 'alt="' . $alt . '" ';
  $output .= get_query_var('amp') || !$objectFit ? '/>' : 'style="' . ($xy ? 'object-position:' . $xy . ';' : '') . '" data-object-fit="cover" data-object-position="' . $xy . '" />';
  return $objectFit ? '<div class="object-fit-container ' . $class . '">' . $output . '</div>' : $output;
  return $output;
}

// Get featured image for background images
function _ws_thumbnail_background($id = null, $options = []) {
  if (get_query_var('amp')) {
    return;
  }
  if (!$id) {
    global $post;
    if ($post) {
      $id = $post->ID;
    }
    else {
      return;
    }
  }
  $class = $options['class'] ?? '';
  if (!has_post_thumbnail($id)) {
    return $class ? 'class="' . $class . '"' : '';
  }
  $size = $options['size'] ?? 'large';
  $lazy = $options['lazy'] ?? true;
  $x = get_post_meta($id, '_featured_image_x', true);
  $y = get_post_meta($id, '_featured_image_y', true);
  $xy = $x !== '' && $y !== '' ? 'background-position: ' . ($x * 100) . '% ' . ($y * 100) . '%;' : '';
  $output = $lazy ? 'class="lazy-load ' . $class . '" data-src="' . get_the_post_thumbnail_url($id, $size) . '" style="' . $xy . '"' : 'class="' . $class . '" style="background-image: url(' . get_the_post_thumbnail_url($id, $size) . ');' . $xy . '"';
  return $output;
}

// Get image by media id
function _ws_image($id = null, $options = []) {
  if (!$id) {
    return '';
  }
  $class = $options['class'] ?? '';
  $attributes = $options['attributes'] ?? '';
  $objectFit = $options['objectFit'] ?? false;
  $objectFitPos = $options['objectFitPos'] ?? false;
  $size = $options['size'] ?? 'large';
  $lazy = $options['lazy'] ?? true;

  $output = '<img ' . $attributes . ' ';
  $output .= !$lazy ? 'class="no-lazy ' . (!$objectFit ? $class : '') . '" ' : 'class="' . (!$objectFit ? $class : '') . '" ';
  $output .= 'src="' . wp_get_attachment_image_src($id, $size)[0] . '" ';
  $output .= 'alt="' . get_post_meta($id, '_wp_attachment_image_alt', true) . '" ';
  $output .= get_query_var('amp') || !$objectFit ? '' : 'data-object-fit="cover" ';
  $output .= $objectFitPos ? 'style="object-position:' . $objectFitPos . ';" data-object-position="' . $objectFitPos . '" />' : '/>';
  return $objectFit ? '<div class="object-fit-container ' . $class . '">' . $output . '</div>' : $output;
}

// Get background image by media id
function _ws_image_background($id = null, $options = []) {
  if (get_query_var('amp')) {
    return;
  }
  $class = $options['class'] ?? '';
  if (!$id) {
    return $class ? 'class="' . $class . '"' : '';
  };
  $size = $options['size'] ?? 'large';
  $lazy = $options['lazy'] ?? true;
  $pos = $options['position'] ?? '';
  $output = $lazy ? 'class="lazy-load ' . $class . '" data-src="' . wp_get_attachment_image_src($id, $size)[0] . '"' : 'class="' . $class . '" style="background-image:url(' . wp_get_attachment_image_src($id, $size)[0] . ');' . ($pos ? 'background-position:' . $pos : '') . '"';
  return $output;
}

// Get image url by slug
function _ws_get_attachment_url_by_slug($slug) {
  $args = [
    'post_type' => 'attachment',
    'name' => sanitize_title($slug),
    'posts_per_page' => 1,
    'post_status' => 'inherit'
  ];
  $_header = get_posts($args);
  $header = $_header ? array_pop($_header) : null;
  return $header ? wp_get_attachment_url($header->ID) : '';
}

// Get directions button
function _ws_directions_url($id = null) {
  if (!$id) {
    global $post;
    $id = $post->ID;
  }
  $loc_readable = get_post_meta($id, '_location-readable', true);
  $url = 'https://www.google.com/maps/dir/?api=1&destination=' . urlencode(str_replace(' <br>', ', ', $loc_readable));
  return $url;
}

// Function to determine if post is in menu
function _ws_in_menu($menu = null, $object_id = null) {
  $menu_object = wp_get_nav_menu_items(esc_attr($menu));
  if (!$menu_object) {
    return false;
  }
  $menu_items = wp_list_pluck($menu_object, 'object_id');
  if (!$object_id) {
    global $post;
    $object_id = get_queried_object_id();
  }
  return in_array((int)$object_id, $menu_items);
}

// Convert wp_get_nav_menu_items into something useful (turns flat array of menu items into hierarchical array)
function _ws_build_menu(array $elements, $parentId = 0) {
  $branch = [];
  foreach ($elements as $element) {
    if (intval($element->menu_item_parent) === $parentId) {
      $children = _ws_build_menu($elements, $element->ID);
      if ($children) {
        $element->children = $children;
      }
      $branch[$element->ID] = $element;
      unset($element);
    }
  }
  return array_values($branch);
}

// Get breadcrumbs from url
function _ws_breadcrumbs($url = null, $includeCurrent = false) {
  $url = $url ?: $_SERVER['REQUEST_URI'];
  $url = preg_match('/https?:\/\//', $url) ? preg_replace('/https?:\/\/.*?\//', '', $url) : $url;
  $pIds = [];
  $urlParts = explode('/', trim($url, '/'));
  $urlPartsCount = count($urlParts);
  for ($i = 0; $i < $urlPartsCount; $i++) {
    $url = '';
    for ($ii = 0; $ii <= $i; $ii++) {
      $url .= $urlParts[$ii] . '/';
    }
    array_push($pIds, url_to_postid($url));
  }
  if (!$includeCurrent) {
    array_pop($pIds);
  }
  if (is_preview()) {
    array_pop($pIds);
  }
  return array_map(function($id) {
    return [
      'id' => $id,
      'url' => get_permalink($id),
      'title' => get_the_title($id)
    ];
  }, $pIds);
}

// Logo
function _ws_logo($light = false) {
  $logo = glob(get_template_directory() . ($light ? '/logo_light.*' : '/logo.*'));
  if ($logo[0]) {
    $parts = explode('/', $logo[0]);
    return get_template_directory_uri() . '/' . $parts[count($parts)-1];
  }
  return false;
}

// cURL
function curlRequest($method, $url, $data = []) {
  $curl = curl_init();
  // POST
  if ($method === 'POST') {
    curl_setopt($curl, CURLOPT_POST, 1);
    if ($data) {
      curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
    }
  }
  // PUT
  else if ($method === 'PUT') {
    curl_setopt($curl, CURLOPT_PUT, 1);
  }
  // GET
  else if ($method === 'GET' && !empty($data)) {
    $url = strpos($url, '?') !== false ? $url . '&' . http_build_query($data) : $url . '?' . http_build_query($data);
  }

  // Optional Authentication:
  // curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
  // curl_setopt($curl, CURLOPT_USERPWD, "username:password");

  curl_setopt($curl, CURLOPT_URL, $url);
  curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

  $result = curl_exec($curl);
  curl_close($curl);
  return $result;
}
