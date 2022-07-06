<?php

// Infinite scroll posts
function _ws_get_more_posts() {
  global $wp_query;
  ob_start();
  $args = json_decode(urldecode($_REQUEST['loop']), true);
  if (isset($_REQUEST['paged'])) {
    $args['paged'] = $_REQUEST['paged'];
  }
  if (isset($args['post_type']) && $args['post_type'] === 'resource_center') {
    $args['post_type'] = ['publication', 'post', 'news'];
  }
  $loop = new WP_Query($args);
  // $count = 0;
  if ($loop->have_posts()) :
    while ($loop->have_posts()) :
      $loop->the_post();
      get_template_part('parts/archive', $_REQUEST['type'] ?? get_post_type());
      // $count++;
      // if ($count === 6 && $args['paged'] === '1' && in_array(get_post_type(), ['all', 'publication', 'post', 'news', 'project'])) {
      //   ob_start();
      //   echo '<h2>Stay up-to-date with Haley & Aldrich</h2>';
      //   echo _ws_block_form(['form' => '<script charset="utf-8" type="text/javascript" src="//js.hsforms.net/forms/v2.js"></script><script>hbspt.forms.create({ portalId: "544233", formId: "a7dd9b24-f49d-45bd-a1db-a4e0b1572f61" });</script>'], '<p>Thank you for subscribing!</p>');
      //   echo '<div class="col-xs-12">' . _ws_block_card(['padding' => true], ob_get_clean()) . '</div>';
      // }
    endwhile;
  endif;
  wp_reset_postdata();
  $output = ob_get_clean();
  $more = true;
  if ($loop->query['paged'] >= $loop->max_num_pages) {
    $more = false;
  }
  wp_send_json(['output' => apply_filters('the_content', $output), 'more' => $more]);
  wp_die();
}
add_action('wp_ajax__ws_get_more_posts', '_ws_get_more_posts');
add_action('wp_ajax_nopriv__ws_get_more_posts', '_ws_get_more_posts');

// Generate Sitemap
function _ws_generate_sitemap() {
  if (_ws_sitemap()) {
    wp_send_json(date("F j, Y g:i A"));
  }
  else {
    wp_send_json(false);
  }
  wp_die();
}
add_action('wp_ajax__ws_generate_sitemap', '_ws_generate_sitemap');
add_action('wp_ajax_nopriv__ws_generate_sitemap', '_ws_generate_sitemap');

// Return csv of pages for bulk edit
function _ws_get_bulk() {
  $types = $_REQUEST['types'];
  if ($types) {
    $postTypes = explode(',', $types);
  }
  else {
    $postTypes = get_post_types(['public'=>true]);
    unset($postTypes['attachment']);
  }
  $ps = get_posts([
    'post_type' => $postTypes,
    'posts_per_page' => -1
  ]);
  $csv = "url,id\n";
  foreach ($ps as $p) {
    if (get_post_meta($p->ID, '_link_external', true) || get_post_meta($p->ID, '_link_lightbox', true)) {
      continue;
    }
    $csv .= get_permalink($p->ID) . "," . $p->ID . "\n";
  }
  wp_send_json($csv);
  wp_die();
}
add_action('wp_ajax__ws_get_bulk', '_ws_get_bulk');
add_action('wp_ajax_nopriv__ws_get_bulk', '_ws_get_bulk');

// Update meta data from uploaded bulk edit csv
function _ws_set_bulk() {
  $count = 0;
  $rows = str_getcsv(stripslashes($_REQUEST['csv']), "\n");
  $colNames = str_getcsv($rows[0]);
  // Row loop
  $rowCount = count($rows);
  for ($i = 1; $i < $rowCount; $i++) {
    $cols = str_getcsv($rows[$i]);
    $id = $cols[0];
    // Insert new post
    if ($id === '0') {
      $count++;
      $titleCol = array_search('post_title', $colNames);
      $id = wp_insert_post([
        'post_title' => $titleCol >= 0 ? trim(stripslashes($cols[$titleCol])) : 'Import ' . $count,
        'post_status' => 'publish'
      ]);
    }
    $post = get_post($id);
    if ($post) {
      // Column loop
      $colCount = count($cols);
      for ($ii = 1; $ii < $colCount; $ii++) {
        $colName = trim($colNames[$ii]);
        $val = trim(stripslashes($cols[$ii]));
        // Meta
        if (substr($colName, 0, 1) === '_' && $val) {
          update_post_meta($id, $colName, $val);
        }
        // Tax terms
        if (substr($colName, 0, 4) === 'tax_' && $val) {
          wp_set_object_terms($id, explode(',', $val), substr($colName, 4));
        }
        // Post info
        else if ($post && array_key_exists($colName, $post) && $val) {
          $post->$colName = $val;
          wp_update_post($post);
        }
      }
    }
  }
  wp_send_json(true);
  wp_die();
}
add_action('wp_ajax__ws_set_bulk', '_ws_set_bulk');
add_action('wp_ajax_nopriv__ws_set_bulk', '_ws_set_bulk');
