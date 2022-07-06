<?php
/**
 * Video lightbox.
 */
function _ws_shortcode_lightbox($atts) {
  $a = shortcode_atts([
    'class' => '',
    'text' => '',
    'url' => ''
  ], $atts);
  $output = '';
  $a['class'] = $a['class'] . (!$a['text'] ? ' icon' : '');
  if ($a['url']) {
    $output = '<button class="lightbox-button ' . $a['class'] . '" data-url="' . $a['url'] . '" ' . (!$a['text'] ? 'aria-label="' . __('Watch Video', '_ws') . '"' : '') . '>';
    $output .= $a['text'] ?: do_shortcode('[svg id="play"]');
    $output .= '</button>';
  }
  return $output;
}
add_shortcode('lightbox', '_ws_shortcode_lightbox');

// Contact form
function _ws_shortcode_form($atts) {
  $a = shortcode_atts([
    'to' => get_bloginfo('admin_email')
  ], $atts);
  $output = '<form class="ajax-form" type="post" action="">
    <label for="name">' . __('Name', '_ws') . '*</label>
    <input id="name" name="name" type="text" required />
    <label for="email">' . __('Email', '_ws') . '*</label>
    <input id="email" name="email" type="email" required />
    <label for="message">' . __('Message', '_ws') . '*</label>
    <textarea id="message" name="message" required></textarea>
    <input type="hidden" name="apiaryProductContainer" value="" />
    <input type="hidden" name="reniatnoCtcudorPyraipa" value="Pooh Bear" />
    <input type="hidden" name="to" value="' . $a['to'] . '" />
    <input type="hidden" name="form" value="contact" />
    <input type="hidden" name="action" value="_ws_send_email" />
    <input type="submit" value="' . __('Submit', '_ws') . '" />
    <div class="error-msg"></div>
  </form>';
  return $output;
}
add_shortcode('form', '_ws_shortcode_form');

// Google Map (Replaced by block)
// function _ws_shortcode_google_map($atts) {
//   $a = shortcode_atts([
//     'location' => ''
//   ], $atts);
//   $output = '';
//   if ($a['location']) {
//     $output = '<iframe class="google-map" width="600" height="450" frameborder="0" src="https://www.google.com/maps/embed/v1/place?key=' . (get_option('google_maps') ?: 'AIzaSyB5dOtdhz53nCEusX4aU4yRKkOGns_Dsn8') . '&q=' . str_replace(' ', '+', strip_tags($a['location'])) . '" allowfullscreen></iframe>';
//   }
//   return $output;
// }
// add_shortcode('google_map', '_ws_shortcode_google_map');

// Search field
function _ws_shortcode_search($atts) {
  $output = '<form class="search-shortcode" method="GET" action="/">
    <input name="s" type="search" />
    <button type="submit">[svg id="search"]</button>
  </form>';
  return do_shortcode($output);
}
add_shortcode('search', '_ws_shortcode_search');

// Menu
function _ws_shortcode_menu($atts) {
  $a = shortcode_atts([
    'name' => ''
  ], $atts);
  $output = '';
  if ($a['name']) {
    $menu = wp_get_nav_menu_object($a['name']);
    $output = wp_nav_menu([
      'menu' => $menu->slug,
      'container' => false,
      'item_spacing' => 'discard',
      'echo' => false
    ]);
  }
  return $output;
}
add_shortcode('menu', '_ws_shortcode_menu');

// Social media share buttons
function _ws_shortcode_share($atts) {
  $a = shortcode_atts([
    'pdf' => '',
    'icons' => ''
  ], $atts);
  $buttons = array_map('trim', explode(',', $a['icons']));
  $output = '';
  $output .= '<div class="share-buttons">';
    if ($a['pdf']) {
      $output .= '<a class="share-button" href="' . $a['pdf'] . '" target="_blank" rel="noopener noreferrer">
        [svg id="download"]
      </a>';
    }
    if (in_array('email', $buttons) || !$a['icons']) {
      $output .= '<a class="share-button" href="mailto:?subject=' . urlencode(get_the_title()) . '&amp;body=' . get_permalink() . '" target="_blank" rel="noopener noreferrer">
        [svg id="send"]
      </a>';
    }
    if (in_array('linkedin', $buttons) || !$a['icons']) {
      $output .= '<a class="share-button" href="https://www.linkedin.com/sharing/share-offsite/?url=' . urlencode(get_permalink()) . '" target="_blank" rel="noopener noreferrer">
        [svg id="linkedin"]
      </a>';
    }
    if (in_array('facebook', $buttons) || !$a['icons']) {
      $output .= '<a class="share-button" href="https://www.facebook.com/sharer/sharer.php?u=' . urlencode(get_permalink()) . '" target="_blank" rel="noopener noreferrer">
        [svg id="facebook"]
      </a>';
    }
    if (in_array('twitter', $buttons) || !$a['icons']) {
      $output .= '<a class="share-button" href="https://twitter.com/intent/tweet?url=' . urlencode(get_permalink()) . '" target="_blank" rel="noopener noreferrer">
        [svg id="twitter"]
      </a>';
    }
  $output .= '</div>';
  return do_shortcode($output);
}
add_shortcode('share_buttons', '_ws_shortcode_share');

// Social icons/links
function _ws_shortcode_social($atts) {
  $a = shortcode_atts([
    'icons' => ['facebook', 'twitter', 'instagram', 'youtube', 'linkedin', 'pinterest', 'soundcloud', 'tumblr']
  ], $atts);
  if (!is_array($a['icons'])) {
    $a['icons'] = explode(',', $a['icons']);
    $a['icons'] = array_map(function($v) {
      return trim($v);
    }, $a['icons']);
  }
  $output = '<div class="wp-block-ws-social-links">';
    $links = get_option('social_links');
    foreach ($a['icons'] as $s) {
      $url = $links[$s] ?? false;
      if ($url) {
        $output .= '<a href="' . $url . '" target="_blank" rel="noopener noreferrer" aria-label="Visit ' . ucwords($s) . '">' . do_shortcode('[svg id="' . $s . '"]') . '</a>';
      }
    }
  $output .= '</div>';
  return $output;
}
add_shortcode('social_links', '_ws_shortcode_social');

// Useful for svg's in the visual editor (WordPress removes svg elements when switching between visual and text)
function _ws_shortcode_svg($atts) {
  $a = shortcode_atts([
    'id' => null,
    'class' => null
  ], $atts);
  $output = '';
  if ($a['id'] && get_option('svg')) {
    $svgs = get_option('svg');
    $i = array_search($a['id'], array_column($svgs, 'id'));
    if ($i !== false) {
      if (isset($svgs[$i]['type']) && $svgs[$i]['type'] === 'animation') {
        $output = '<div class="svg-animation-container svg-animation ' . $a['class'] . '" data-name="' . uniqid($svgs[$i]['id'] . '-') . '" data-src="' . urlencode($svgs[$i]['json']) . '"></div>';
      }
      else {
        $d = explode(' ', $svgs[$i]['viewbox']);
        $width = $d[2] - $d[0];
        $height = $d[3] - $d[1];
        $output = '<svg' . ($a['class'] ? ' class="' . $a['class'] . '"' : '') . ' width="' . $width . '" height="' . $height . '" viewBox="' . $svgs[$i]['viewbox'] . '" fill-rule="evenodd"><title>' . $svgs[$i]['title'] . '</title>' . $svgs[$i]['path'] . '</svg>';
      }
    }
  }
  return $output;
}
add_shortcode('svg', '_ws_shortcode_svg');

// Year (useful for copyright)
function _ws_shortcode_year() {
  return date('Y');
}
add_shortcode('year', '_ws_shortcode_year');

// Print the logo
function _ws_shortcode_logo($atts) {
  $a = shortcode_atts([
    'link' => null,
    'light' => false
  ], $atts);
  $output = '';
  if (_ws_logo($a['light'])) {
    $output = '<img ' . (!$a['link'] ? 'class="logo-shortcode"' : '') . ' src="' . _ws_logo($a['light']) . '" alt="' . get_bloginfo('name') . '" />';
  }
  if ($a['link']) {
    $output = '<a class="logo-shortcode" href="' . esc_url(home_url('/')) . '" rel="home">' . $output . '</a>';
  }
  return $output;
}
add_shortcode('logo', '_ws_shortcode_logo');

// Print the address
function _ws_shortcode_address($atts) {
  $a = shortcode_atts([
    'phone' => null
  ], $atts);
  $output = '<p class="address-shortcode">' . str_replace(',', '<br />', get_option('site_location_street')) . '<br/>' . get_option('site_location_city') . ', ' . get_option('site_location_state') . ' ' . get_option('site_location_zip');
  if ($a['phone']) {
    $output .= '<br /><a href="tel:' . get_option('site_phone') . '" rel="home">' . get_option('site_phone') . '</a>';
  }
  $output .= '</p>';
  return $output;
}
add_shortcode('address', '_ws_shortcode_address');

// Question
function _ws_shortcode_question($atts, $content = null) {
  $a = shortcode_atts([
    'id' => '',
    'name' => '',
    'type' => 'number',
    'default' => '',
    'options' => ''
  ], $atts);
  $a['options'] = explode(',', $a['options']);
  $output = '';
  if ($a['type'] === 'number' || $a['type'] === 'text' || $a['type'] === 'email') {
    $output = '<label for="' . $a['id'] . '">' . $content . '</label>
    <input id="' . $a['id'] . '" name="' . ($a['name'] ?: $a['id']) . '" v-model="data.' . ($a['name'] ?: $a['id']) . '" type="' . $a['type'] . '" placeholder="' . $a['default'] . '" />';
  }
  else if ($a['type'] === 'textarea') {
    $output = '<label for="' . $a['id'] . '">' . $content . '</label>
    <textarea id="' . $a['id'] . '" name="' . ($a['name'] ?: $a['id']) . '" v-model="data.' . ($a['name'] ?: $a['id']) . '" placeholder="' . $a['default'] . '"></textarea>';
  }
  else if ($a['type'] === 'select') {
    $output = '<label for="' . $a['id'] . '">' . $content . '</label>
    <select id="' . $a['id'] . '" name="' . ($a['name'] ?: $a['id']) . '" v-model="data.' . ($a['name'] ?: $a['id']) . '">';
      foreach ($a['options'] as $option) {
        $option = explode('=', $option);
        $output .= '<option value="' . $option[1] . '" ' . ($a['default'] === $option[0] ? 'selected' : '') . '>' . $option[0] . '</option>';
      }
    $output .= '</select>';
  }
  else if ($a['type'] === 'radio') {
    $output = '<fieldset id="' . $a['id'] . '">
      <legend>' . $content . '</legend>';
      foreach ($a['options'] as $option) {
        $option = explode('=', $option);
        $output .= '<input id="' . $a['id'] . '-' . $option[1] . '" name="' . ($a['name'] ?: $a['id']) . '" v-model="data.' . ($a['name'] ?: $a['id']) . '" value="' . $option[1] . '" type="radio" ' . ($a['default'] === $option[0] ? 'checked' : '') . ' />
        <label for="' . $a['id'] . '-' . $option[1] . '">' . $option[0] . '</label>';
      }
    $output .= '</fieldset>';
  }
  else if ($a['type'] === 'checkbox') {
    $output = '<fieldset id="' . $a['id'] . '">
      <legend>' . $content . '</legend>';
      echo $a['default'];
      foreach ($a['options'] as $option) {
        $option = explode('=', $option);
        $output .= '<input id="' . $a['id'] . '-' . $option[1] . '" name="' . ($a['name'] ?: $a['id']) . '" v-model="data.' . ($a['name'] ?: $a['id']) . '" value="' . $option[1] . '" type="checkbox" ' . ($a['default'] === $option[0] ? 'checked' : '') . ' />
        <label for="' . $a['id'] . '-' . $option[1] . '">' . $option[0] . '</label>';
      }
    $output .= '</fieldset>';
  }
  return $output;
}
add_shortcode('question', '_ws_shortcode_question');
