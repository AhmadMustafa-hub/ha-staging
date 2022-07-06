<?php
function _ws_block_related_projects($a) {
  $a['className'] = 'wp-block-ws-related-projects slider ' . ($a['className'] ?? '');
  $postType = 'project';
  $numPosts = $a['numPosts'] ?? 8;
  $numPosts = isset($a['allPosts']) && $a['allPosts'] ? -1 : $numPosts;
  $taxTerms = $a['taxTerms'] ?? [];
  $horizontalScroll = isset($a['horizontalScroll']) && $a['horizontalScroll'] ? 'horizontal-scroll' : '';
  $type = $postType;
  ob_start(); ?>
<h3 class="left-heading">Related Projects</h3>
<h3 class="view-all"><a href="#">View All</a></h3>
<div class="row card-row <?= $horizontalScroll; ?>">

    <?php
      $ps = get_posts(_ws_latest_upcoming_build_args($postType, $numPosts, $taxTerms));
      if ($postType === 'event') {
        $ps = array_filter($ps, function($v) {
          return time() <= strtotime(get_post_meta($v->ID, '_event_start_date', true));
        });
      }
      global $post;
      foreach ($ps as $i=>$post) {
        setup_postdata($post);
        get_template_part('parts/projects', $type);
      }
      wp_reset_postdata(); ?>
    <div class="buttons"> <button class="btn-slides btn-next-slide">></button>
        <button class="btn-slides btn-prev-slide">
            < </button>
    </div>
</div>
<?php
  return _ws_block_wrapping($a, ob_get_clean(), 'div ');
}

function _ws_related_projects_build_args($postType, $numPosts, $taxTerms) {
  global $post;
  $args = [
    'post_type' => $postType,
    'posts_per_page' => $numPosts,
    'post_status' => 'publish'
  ];
  // Tax query
  $queries = [];
  foreach ($taxTerms as $tax=>$terms) {
    array_push($queries, [
      'taxonomy' => $tax,
      'field' => 'id',
      'terms' => $terms
    ]);
  }
  if (!empty($queries)) {
    $queries['relation'] = 'OR';
    $args['tax_query'] = $queries;
  }
  // Event ordering
  if ($postType === 'event') {
    $args['meta_query'] = [
      [
        'key' => '_event_start_date',
        'value' => date('Y-m-d\TH:i:s'),
        'compare' => '>='
      ]
    ];
    $args['orderby'] = 'meta_value';
    $args['meta_key'] = '_event_start_date';
    $args['order'] = 'DESC';
  }
  return $args;
}