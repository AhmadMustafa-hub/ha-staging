<?php
// Register custom api endpoints
function _ws_api_endpoint_menus() {
  register_rest_route('ws', '/menus', [
    'methods' => 'GET',
    'callback' => function($data) {
      $id = $data->get_param('id');
      $slug = $data->get_param('slug');
      $name = $data->get_param('name');
      $location = $data->get_param('location');
      if ($location) {
        return _ws_build_menu(wp_get_nav_menu_items(get_term(get_nav_menu_locations()[$location], 'nav_menu')->name));
      }
      $menus = array_map(function($menu) {
        return [
          'id' => $menu->term_id,
          'slug' => $menu->slug,
          'name' => $menu->name,
          'menu_items' => _ws_build_menu(wp_get_nav_menu_items($menu->term_id))
        ];
      }, wp_get_nav_menus());
      $menus = array_filter($menus, function($menu) use($id, $slug, $name) {
        if ($id) {
          return intval($menu['id']) === intval($id);
        }
        else if ($slug) {
          return $menu['slug'] === $slug;
        }
        else if ($name) {
          return $menu['name'] === $name;
        }
        return true;
      });
      return array_values($menus);
    }
  ]);
}
add_action('rest_api_init', '_ws_api_endpoint_menus');

// function _ws_api_endpoint_menu_by_name() {
//   register_rest_route('ws', '/menu/name/(?P<name>\w+)', [
//     'methods' => 'GET',
//     'callback' => function($data) {
//       return wp_nav_menu($data['name'])
//     }
//   ]);
// }
// add_action('rest_api_init', '_ws_api_endpoint_menu_by_location');

function _ws_api_endpoint_widget() {
  register_rest_route('ws', '/widget/(?P<location>\w+)', [
    'methods' => 'GET',
    'callback' => function($data) {
      // ob_start();
      // dynamic_sidebar($data['location']);
      // $widget = ob_get_clean();
      return dynamic_sidebar($data['location']);
    }
  ]);
}
add_action('rest_api_init', '_ws_api_endpoint_widget');

function _ws_api_endpoint_all() {
  register_rest_route('ws', '/all', [
    'methods' => 'GET',
    'callback' => function($data) {
      $args = [
        'post_type' => $data->get_param('post_type') ?: 'any',
        'posts_per_page' => $data->get_param('posts_per_page') ?: -1,
        'include' => $data->get_param('include') ? explode(',', $data->get_param('include')) : '',
        'post_parent' => $data->get_param('post_parent') ?: '',
        'paged' => $data->get_param('paged') ?: 0
      ];
      if ($data->get_param('s')) {
        $args['s'] = $data->get_param('s');
      }
      // Tax query
      if ($data->get_param('terms')) {
        $terms = explode(',', $data->get_param('terms'));
        $queries = [];
        foreach ($terms as $term) {
          $taxTerm = explode('~', $term);
          array_push($queries, [
            'taxonomy' => $taxTerm[0],
            'field' => 'slug',
            'terms' => $taxTerm[1]
          ]);
        }
        if (!empty($queries)) {
          $args['tax_query'] = $queries;
        }
      }
      // Event ordering
      if ($data->get_param('post_type') === 'event') {
        $args['orderby'] = 'meta_value';
        $args['meta_key'] = '_event_start_date';
        $args['order'] = 'ASC';
      }
      // Get posts
      $posts = get_posts($args);
      $posts = array_map(function($v) {
        $v->total = wp_count_posts($v->post_type)->publish;
        $v->post_excerpt = get_the_excerpt($v->ID);
        $v->thumbnail = get_the_post_thumbnail_url($v->ID, 'medium');
        if ($v->post_type === 'event') {
          $v->start_date = get_post_meta($v->ID, '_event_start_date', true);
        }
        return $v;
      }, $posts);
      return rest_ensure_response($posts);
    }
  ]);
}
add_action('rest_api_init', '_ws_api_endpoint_all');

function _ws_api_endpoint_taxterm() {
  register_rest_route('ws', '/taxterm', [
    'methods' => 'GET',
    'callback' => function($data) {
      $taxonomies = get_object_taxonomies($data->get_param('post_type'));
      $taxonomies = array_map(function($v) {
        $taxes = get_taxonomy($v);
        $taxes->terms = get_terms($v);
        return $taxes;
      }, $taxonomies);
      return rest_ensure_response($taxonomies);
    }
  ]);
}
add_action('rest_api_init', '_ws_api_endpoint_taxterm');

function _ws_api_endpoint_years() {
  register_rest_route('ws', '/years', [
    'methods' => 'GET',
    'callback' => function($data) {
      $output = [];
      $years = wp_get_archives([
        'type' => 'yearly',
        'format' => 'custom',
        'echo' => 0,
        'post_type' => $data->get_param('post_type')
      ]);
      $years = explode('</a>', $years);
      array_pop($years);
      foreach ($years as $i=>$year) {
        $year = substr($year, -4);
        array_push($output, $year);
      }
      return rest_ensure_response($output);
    }
  ]);
}
add_action('rest_api_init', '_ws_api_endpoint_years');

function _ws_api_endpoint_breadcrumbs() {
  register_rest_route('ws', '/breadcrumbs/(?P<postId>\w+)', [
    'methods' => 'GET',
    'callback' => function($data) {
      $url = get_permalink($data['postId']);
      $includeCurrent = $data->get_param('include_current') ? true : false;
      return rest_ensure_response(_ws_breadcrumbs($url, $includeCurrent));
    }
  ]);
}
add_action('rest_api_init', '_ws_api_endpoint_breadcrumbs');

function _ws_filter_rest_event_query($data, $request) {
  $upcoming = $request->get_param('upcoming');
  $tz = 300; //America/Chicago
  if (isset($_COOKIE['tzOffset'])) {
    $tz = $_COOKIE['tzOffset'];
  }
  if ($request->get_param('timezone')) {
    $tz = $request->get_param('timezone');
  }
  $tzName = timezone_name_from_abbr('', intval($tz) * -60, 1);
  $dt = new DateTime('now', new DateTimeZone($tzName));
  $dt->setTimestamp(time());
  if (isset($upcoming)) {
    $data['orderby'] = 'meta_value';
    $data['meta_key'] = '_event_start_date';
    $data['order'] = 'ASC';
  }
  if ($upcoming === 'future') {
    $data['meta_query'] = [
      [
        'key' => '_event_start_date',
        'value' => $dt->format('Y-m-d\TH:i:s'),
        'compare' => '>='
      ]
    ];
  }
  if ($upcoming === 'past') {
    $data['meta_query'] = [
      [
        'key' => '_event_start_date',
        'value' => $dt->format('Y-m-d\TH:i:s'),
        'compare' => '<'
      ]
    ];
  }
  return $data;
}
add_filter('rest_event_query', '_ws_filter_rest_event_query', 10, 2);
