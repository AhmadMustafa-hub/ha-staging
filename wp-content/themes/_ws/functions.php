<?php
$GLOBALS['ws_config'] = [
  'amp' => false,
  'bulk' => true,
  'caching' => false,
  'pwa' => false,
  'redirects' => false
];

function _ws_setup() {
  // Make theme available for translation.
  load_theme_textdomain('_ws', get_template_directory() . '/languages');

  add_theme_support('post-thumbnails');
  add_image_size('small', 256, 256, false);
  add_theme_support('html5', [
    'search-form',
    'comment-form',
    'comment-list',
    'gallery',
    'caption'
  ]);

  // Add excerpt support for pages
  add_post_type_support('page', 'excerpt');

  // Register nav locations
  register_nav_menus([
    'header' => __('Header', '_ws')
  ]);
  register_nav_menus([
    'footer' => __('Footer', '_ws')
  ]);
  register_nav_menus([
    'footer-legal' => __('Footer Legal', '_ws')
  ]);

  // Remove junk from head
  remove_action('wp_head', 'wp_generator'); // Wordpress version
  remove_action('wp_head', 'rsd_link'); // Really Simple Discovery
  remove_action('wp_head', 'wlwmanifest_link'); // Windows Live Writer
  remove_action('wp_head', 'print_emoji_detection_script', 7); // Emojis :(
  remove_action('wp_print_styles', 'print_emoji_styles'); // Emojis :(
  add_filter('emoji_svg_url', '__return_false'); // Emojis :(
  remove_action('wp_head', 'wp_shortlink_wp_head'); // Page shortlink
  remove_action('wp_head', 'parent_post_rel_link'); // Navigation links
  remove_action('wp_head', 'rest_output_link_wp_head'); // JSON
  remove_action('wp_head', 'wp_oembed_add_discovery_links'); // JSON
  remove_action('wp_head', 'rel_canonical'); // If there's more than one canonical, neither will work, so we remove the default one and use ours

  // Enable shortcodes in widgets
  add_filter('widget_text', 'do_shortcode');
}
add_action('after_setup_theme', '_ws_setup');

// Remove trackback/pingback support
function _ws_remove_post_support() {
  remove_post_type_support('post', 'trackbacks');
}
add_action('init', '_ws_remove_post_support');

// Disable author archives
function _ws_disable_author_archives() {
  if (is_author()) {
    global $wp_query;
    $wp_query->set_404();
    status_header(404);
  }
  else {
    redirect_canonical();
  }
}
remove_filter('template_redirect', 'redirect_canonical');
add_action('template_redirect', '_ws_disable_author_archives');

// Register widget areas
function _ws_register_widget_areas() {
  register_sidebar([
    'name' => __('Footer Left', '_ws'),
    'id' => 'footer-left',
    'description' => __('Widgets in this area will appear in the left side of the footer', '_ws')
  ]);
}
add_action('widgets_init', '_ws_register_widget_areas');

// Set excerpt word length
function _ws_excerpt_length() {
  return 30; // Default = 55
}
add_filter('excerpt_length', '_ws_excerpt_length', 999);

// General content filters
function _ws_content_filter($content) {
  $content = force_balance_tags($content);
  $content = preg_replace('/<p>[\t\r\n\s]*<\/p>/', '', $content);

  // Fix Vue transition-group elements
  $content = preg_replace(
    '/<transition -group/',
    '<transition-group',
    $content
  );

  // Give iframe's unique name attributes for iframe communcation
  $count = 0;
  $content = preg_replace_callback(
    '/<iframe(?![^>]+name=)/',
    function($matches) use (&$count) {
      $count++;
      return '<iframe name="iframe-' . $count . '"';
    },
    $content
  );

  return $content;
}
add_filter('the_content', '_ws_content_filter');

// Remove any content within meta blocks
function _ws_meta_content_filter($content) {
  $content = preg_replace(
    '/<!-- wp:ws\/meta-[^\/]+?-->.*?<!-- \/wp:ws\/meta-.+?-->/s',
    '',
    $content
  );

  return $content;
}
add_filter('the_content', '_ws_meta_content_filter', 1);

function _ws_add_headers($headers) {
  $headers['X-XSS-Protection'] = '1; mode=block';
  $headers['X-Frame-Options'] = 'sameorigin';
  $headers['X-Content-Type-Options'] = 'nosniff';
  $headers['Referrer-Policy'] = 'origin-when-cross-origin';
  return $headers;
}
add_filter('wp_headers', '_ws_add_headers');

// Remove custom css from Customizer
function _ws_remove_customizer_css($wp_customize) {
  $wp_customize->remove_control('custom_css');
}
add_action('customize_register', '_ws_remove_customizer_css');

// PHP files
foreach (glob(get_template_directory() . '/inc/*.php') as $filename) {
  include_once $filename;
}
foreach (glob(get_template_directory() . '/inc/classes/*.php') as $filename) {
  include_once $filename;
}
foreach (glob(get_template_directory() . '/inc/options/*.php') as $filename) {
  include_once $filename;
}
foreach (glob(get_template_directory() . '/post-types/*.php') as $filename) {
  include_once $filename;
}
add_action('wp_footer', 'related_projects_slides');
function related_projects_slides(){
?>
<script>
// Select all slides
const slides = document.querySelectorAll(".slide");

// loop through slides and set each slides translateX property to index * 100% 
slides.forEach((slide, indx) => {
    slide.style.transform = `translateX(${indx * 100}%)`;
});
// current slide counter
let curSlide = 0;

// select next slide button

const nextSlide = document.querySelector(".btn-next-slide");
// add event listener and next slide functionality

// nextSlide.addEventListener("click", function() {
//     curSlide++;

//     slides.forEach((slide, indx) => {
//         slide.style.transform = `translateX(${100 * (indx - curSlide)}%)`;
//     });
// });

// select next slide button

// current slide counter
// maximum number of slides
let maxSlide = slides.length - 3;

// add event listener and navigation functionality
nextSlide.addEventListener("click", function() {
    // check if current slide is the last and reset current slide
    if (curSlide === maxSlide) {
        curSlide = 0;
        console.log(curSlide);
    } else {
        curSlide = curSlide + 1;
    }

    //   move slide by -100%
    slides.forEach((slide, indx) => {
        slide.style.transform = `translateX(${100 * (indx - curSlide)}%)`;
    });
});
// select prev slide button
const prevSlide = document.querySelector(".btn-prev-slide");

// add event listener and navigation functionality
prevSlide.addEventListener("click", function() {
    // check if current slide is the first and reset current slide to last
    if (curSlide === 0) {
        curSlide = maxSlide;

    } else {
        curSlide = curSlide - 1;
    }

    //   move slide by 100%
    slides.forEach((slide, indx) => {
        slide.style.transform = `translateX(${100 * (indx - curSlide)}%)`;
    });
});
</script>
<?php
};