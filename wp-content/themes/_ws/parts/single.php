<?php
$kpi1 = get_post_meta(get_the_ID(), '_project_kpi_1', true);
$kpiDescription1 = get_post_meta(get_the_ID(), '_project_kpi_description_1', true);
$kpi2 = get_post_meta(get_the_ID(), '_project_kpi_2', true);
$kpiDescription2 = get_post_meta(get_the_ID(), '_project_kpi_description_2', true);
$kpi3 = get_post_meta(get_the_ID(), '_project_kpi_3', true);
$kpiDescription3 = get_post_meta(get_the_ID(), '_project_kpi_description_3', true);
$markets = get_the_terms(get_the_ID(), 'market') ?: [];
$services = get_the_terms(get_the_ID(), 'service') ?: []; ?>
<div id="main" class="main single-view">
  <section class="ws-block-section padding-top-50 padding-bottom-50">
    <div class="container section-container">
      <div class="row section-row">
        <div class="col-xs-12 section-col">
          <div class="wp-block-ws-card card extra-padding">
            <div class="card-body">
              <?php
              $subhead = _ws_get_post_type_label();
              $company = get_post_meta(get_the_ID(), '_project_company', true);
              $location = get_post_meta(get_the_ID(), '_project_location', true);
              if ($company || $location) {
                $subhead = implode('&nbsp;&middot;&nbsp;', array_filter([$company, $location]));
              } ?>
              <p class="subhead single-subhead"><?= $subhead; ?></p>
              <h1 class="wp-block-ws-page-title has-text-align-center"><?= get_the_title(); ?></h1>
              <?php
              if ($kpi1 || $kpi2 || $kpi3) : ?>
                <div class="row kpis">
                  <?php
                  if ($kpi1) {
                    echo _ws_block_kpi(['kpi' => $kpi1, 'label' => $kpiDescription1]);
                  }
                  if ($kpi2) {
                    echo _ws_block_kpi(['kpi' => $kpi2, 'label' => $kpiDescription2]);
                  }
                  if ($kpi3) {
                    echo _ws_block_kpi(['kpi' => $kpi3, 'label' => $kpiDescription3]);
                  } ?>
                </div>
                <?php
              endif;
              echo _ws_thumbnail(get_the_ID(), ['size' => 'full', 'class' => 'featured-image']); ?>
              <div class="text">
                <?php
                the_content();
                if (get_post_type() === 'post') {
                  echo '<p class="publish-date">Published: ' . get_the_date('n/j/Y') . '</p>';
                }
                $termObjects = array_merge($markets, $services);;
                if (count($termObjects)) {
                  echo '<ul class="terms">';
                    foreach ($termObjects as $termObject) {
                      $link = get_term_meta($termObject->term_id, 'term-link', true);
                      echo '<li><a href="' . $link . '">' . $termObject->name . '</a></li>';
                    }
                  echo '</ul>';
                }
                $authors = get_post_meta(get_the_ID(), '_authors', true);
                if ($authors) {
                  echo '<h3>' . __('Authors', '_ws') . '</h3>';
                  echo apply_filters('the_content', $authors);
                } ?>
              </div>
            </div>
          </div>
          <?= _ws_get_prev_next(); ?>
        </div>
      </div>
    </div>
  </section>
  <?php
  $marketTermIds = array_map(function($market) {
    return $market->term_id;
  }, $markets);
  $serviceTermIds = array_map(function($service) {
    return $service->term_id;
  }, $services);
  $posts = get_posts([
    'post_type' => get_post_type(),
    'post__not_in' => [get_the_ID()],
    'orderby' => 'rand',
    'posts_per_page' => 3,
    'post_status' => 'publish',
    'tax_query' => [
      'relation' => 'OR',
      [
        'taxonomy' => 'market',
        'field' => 'term_id',
        'terms' => $marketTermIds
      ],
      [
        'taxonomy' => 'service',
        'field' => 'term_id',
        'terms' => $serviceTermIds
      ]
    ]
  ]);
  if (count($posts)) : ?>
    <section class="ws-block-section padding-top-50">
      <div class="container section-container">
        <div class="row section-row">
          <div class="col-xs-12 section-col">
            <div class="wp-block-ws-split align-items-center">
              <div class="wp-block-ws-split-half col">
                <h2>Related resources</h2>
              </div>
              <div class="wp-block-ws-split-half col">
                <div class="wp-block-buttons has-text-align-right">
                  <div class="wp-block-button is-style-simple">
                    <a class="wp-block-button__link" href="/resources/">View all Resources</a>
                  </div>
                </div>
              </div>
            </div>
            <?php
            $ids = array_map(function($p) {
              return $p->ID;
            }, $posts); ?>
            <?= do_shortcode(_ws_block_select_content(['ids' => array_slice($ids, 0, 3)])); ?>
          </div>
        </div>
      </div>
    </section>
    <?php
  endif; ?>
</div>
