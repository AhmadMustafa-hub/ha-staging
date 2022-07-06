<?php
// Global so the _ws_block_wrapping function can use it
global $colors;
$themeJson = json_decode(file_get_contents(get_template_directory() . '/theme.json'), true);
$colors = $themeJson['global']['colors'];

function _ws_blocks_setup() {
  global $colors;
  add_theme_support('editor-color-palette', $colors);
  add_theme_support('disable-custom-font-sizes');
  add_theme_support('responsive-embeds');
  add_theme_support('editor-font-sizes', [
    [
      'name' => __('Normal', '_ws'),
      'shortName' => __('M', '_ws'),
      'size' => 16,
      'slug' => 'normal'
    ]
  ]);
}
add_action('after_setup_theme', '_ws_blocks_setup');

// Enqueue block editor scripts
function _ws_enqueue_block_scripts() {
  wp_localize_script('blocks-js', 'locals', [
    'google_maps' => get_option('google_maps') ?: 'AIzaSyB5dOtdhz53nCEusX4aU4yRKkOGns_Dsn8',
    'svgs' => get_option('svg') ?: [],
    'posts_per_page' => get_option('posts_per_page')
  ]);
  wp_enqueue_script('blocks-js');
  wp_enqueue_script('sidebar-js');
}
add_action('enqueue_block_editor_assets', '_ws_enqueue_block_scripts');

// Setup custom block categories
function _ws_block_categories($categories) {
  return array_merge(
    $categories,
    [
      [
        'slug' => 'ws-top-level',
        'title' => __('Top Level (WS)', '_ws')
      ],
      [
        'slug' => 'ws-layout',
        'title' => __('Layout (WS)', '_ws')
      ],
      [
        'slug' => 'ws-dynamic',
        'title' => __('Dynamic (WS)', '_ws')
      ],
      [
        'slug' => 'ws-bit',
        'title' => __('Bits (WS)', '_ws')
      ],
      [
        'slug' => 'ws-meta',
        'title' => __('Metas (WS)', '_ws')
      ],
      [
        'slug' => 'ws-calculator',
        'title' => __('Calculator (WS)', '_ws')
      ]
    ]
  );
}
add_filter('block_categories', '_ws_block_categories', 10, 2);

// Wrap sections in consistent markup
function _ws_block_wrapping($a, $content, $element = 'section') {
  $classesArray = explode(' ', $a['className']);
  _ws_block_build_classes($a, $classesArray);
  $customColors = _ws_block_build_colors($a, $classesArray);
  $background = false;
  foreach ($a as $key => $value) {
    if (in_array($key, ['backgroundMedia', 'backgroundColor', 'backgroundGradient', 'backgroundGeometric']) && $value) {
      $background = true;
    }
  }
  $anchor = isset($a['anchor']) && $a['anchor'] ? 'id="' . $a['anchor'] . '"' : '';
  $class = count($classesArray) ? 'class="' . implode(' ', $classesArray) . '"' : '';
  $backgroundMediaUrl = false;
  if (isset($a['backgroundMedia']) && $a['backgroundMedia']) {
    $backgroundMediaUrl = wp_get_attachment_image_src($a['backgroundMedia'], 'full')[0] ?: wp_get_attachment_url($a['backgroundMedia']);
  }
  $backgroundPosition = isset($a['backgroundX']) || isset($a['backgroundY']) ? 'style="background-position:' . ($a['backgroundX'] ?? 0.5) * 100 . '% ' . ($a['backgroundY'] ?? 0.5) * 100 . '%"' : '';
  ob_start(); ?>
    <<?= $element . ' ' . $anchor . ' ' . $class . ' ' . (isset($customColors['customTextColor']) ? $customColors['customTextColor'] : ''); ?>>
      <?php
      if ($background) : ?>
        <div class="block-background" <?= (isset($customColors['customBackgroundColor']) ? $customColors['customBackgroundColor'] : '') ?>>
          <?php
          if (isset($a['backgroundGeometric']) && count($a['backgroundGeometric'])) {
            foreach ($a['backgroundGeometric'] as $geometric) {
              echo '<img class="geometric-shape-' . $geometric . '" src="/wp-content/themes/_ws/assets/geometric.svg" alt="Geometric Decoration" />';
            }
          }
          if ($backgroundMediaUrl) :
            if (substr($backgroundMediaUrl, -4) === '.mp4') :
              $backgroundVideoPoster = isset($a['backgroundVideoPoster']) && $a['backgroundVideoPoster'] ? 'poster="' . $a['backgroundVideoPoster'] . '"' : ''; ?>
              <div class="block-background-media <?= isset($a['backgroundParallax']) && $a['backgroundParallax'] ? 'parallax-bg' : ''; ?>">
                <video class="block-background-video" autoplay loop muted playsinline <?= $backgroundVideoPoster; ?>>
                  <source src="<?= $backgroundMediaUrl; ?>" type="video/mp4" />
                </video>
              </div>
              <?php
            else: ?>
              <div class="block-background-media lazy-load <?= isset($a['backgroundParallax']) && $a['backgroundParallax'] ? 'parallax-bg' : ''; ?>" data-src="<?= $backgroundMediaUrl; ?>" <?= $backgroundPosition; ?>></div>
              <?php
            endif;
          endif; ?>
        </div>
        <?php
      endif; ?>
      <?= $content; ?>
    </<?= $element; ?>>
  <?php
  return ob_get_clean();
}

function _ws_block_build_classes($a, &$classesArray) {
  $keysAndClasses = [
    'backgroundColor' => 'has-background-color',
    'backgroundOverlay' => 'has-overlay',
    'textColor' => 'has-text-color'
  ];
  foreach ($keysAndClasses as $key=>$class) {
    if (isset($a[$key]) && $a[$key]) {
      array_push($classesArray, $class);
    }
  }
  if (isset($a['backgroundShape']) && $a['backgroundShape']) {
    array_push($classesArray, 'has-' . $a['backgroundShape'] . '-background-shape');
  }
  if (isset($a['backgroundGradient']) && $a['backgroundGradient']) {
    array_push($classesArray, 'has-' . $a['backgroundGradient'] . '-background-gradient');
  }
  if (isset($a['paddingTop'])) {
    array_push($classesArray, 'padding-top-' . $a['paddingTop']);
  }
  if (isset($a['paddingBottom'])) {
    array_push($classesArray, 'padding-bottom-' . $a['paddingBottom']);
  }
  if (isset($a['backgroundSize'])) {
    array_push($classesArray, 'has-' . $a['backgroundSize'] . '-background-size');
  }
}

function _ws_block_build_colors($a, &$classesArray) {
  $output = [];
  if (isset($a['backgroundColor']) && $a['backgroundColor']) {
    $colorSlug = _ws_get_color_slug($a['backgroundColor']);
    if ($colorSlug) {
      array_push($classesArray, 'has-' . $colorSlug . '-background-color');
    }
    else {
      $output['customBackgroundColor'] = 'style="background-color:' . $a['backgroundColor'] . '"';
    }
  }
  if (isset($a['textColor']) && $a['textColor']) {
    $colorSlug = _ws_get_color_slug($a['textColor']);
    if ($colorSlug) {
      array_push($classesArray, 'has-' . $colorSlug . '-color');
    }
    else {
      $output['customTextColor'] = 'style="color:' . $a['textColor'] . '"';
    }
  }
  return $output;
}

// Pull server render files from block directory
$GLOBALS['block_renders'] = [];
function rglob($pattern) {
  $files = glob($pattern);
  foreach (glob(dirname($pattern).'/*', GLOB_ONLYDIR|GLOB_NOSORT) as $dir) {
    $files = array_merge($files, rglob($dir.'/'.basename($pattern)));
  }
  return $files;
}

foreach (rglob(get_template_directory() . '/blocks/**/render.php') as $filename) {
  include_once $filename;
  $fileparts = explode('/', $filename);
  global $block_renders;
  array_push($block_renders, $fileparts[count($fileparts) - 2]);
}

// Register server block renders
function _ws_register_dynamic_blocks() {
  global $block_renders;
  foreach ($block_renders as $block) {
    register_block_type('ws/' . $block, [
      'editor_script' => 'blocks-js',
      'render_callback' => '_ws_block_' . str_replace('-', '_', $block)
    ]);
  }
}
add_action('init', '_ws_register_dynamic_blocks');
