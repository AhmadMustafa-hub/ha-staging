<?php
function _ws_block_archive($a) {
  $a['className'] = 'ws-block-archive ' . ($a['className'] ?? '');
  $postType = $a['postType'] ?? 'post';
  $postType = isset($a['resourceCenter']) && $a['resourceCenter'] ? 'resource_center' : $postType;
  $filters = $a['filters'] ?? [];
  $search = $a['search'] ?? false;
  $numPosts = $a['numPosts'] ?? get_option('posts_per_page');
  $numPosts = isset($a['allPosts']) && $a['allPosts'] ? -1 : $numPosts;
  $type = in_array($postType, ['resource_center', 'project', 'publication', 'post', 'news']) ? 'card' : $postType;
  ob_start();
    _ws_archive_build_filters($filters, $search, $postType, $numPosts); ?>
    <div class="archive-results row <?= $type; ?>-row" data-type="<?= $type; ?>"></div>
  <?php
  return _ws_block_wrapping($a, ob_get_clean(), 'div');
}

function _ws_archive_build_filters($filters, $search, $postType, $numPosts) {
  ?>
  <form class="archive-filters" action="#filtered" method="GET">
    <input type="hidden" name="post_type" value="<?= $postType; ?>" />
    <input type="hidden" name="posts_per_page" value="<?= $numPosts; ?>" />
    <div class="row">
      <?php
      foreach ($filters as $tax) :
        if ($tax === 'year') : ?>
          <div class="col-lg-3 col-md-4 col-sm-6">
            <label for="archive-filter-year"><?= __('Filter by Year', '_ws'); ?></label>
            <select id="archive-filter-year" name="filter-year">
              <option value="">All Years</option>
              <?php
              $years = wp_get_archives([
                'type' => 'yearly',
                'format' => 'custom',
                'echo' => 0,
                'post_type' => $postType
              ]);
              $years = explode('</a>', $years);
              array_pop($years);
              foreach ($years as $i=>$year) :
                $year = substr($year, -4); ?>
                <option value="<?= $year; ?>" <?= isset($_GET['filter-year']) && $_GET['filter-year'] === $year ? 'selected' : ''; ?>><?= $year; ?></option>
                <?php
              endforeach; ?>
            </select>
          </div>
          <?php
        elseif ($tax === 'timeline') : ?>
          <div class="col-lg-3 col-md-4 col-sm-6">
            <label for="archive-filter-timeline" class="screen-reader-text"><?= __('Past & Upcoming', '_ws'); ?></label>
            <select id="archive-filter-timeline" name="filter-timeline">
              <option value="">Select Filter</option>
              <option value="upcoming" <?= isset($_GET['filter-timeline']) && $_GET['filter-timeline'] === 'upcoming' ? 'selected' : ''; ?>>Upcoming</option>
              <option value="past" <?= isset($_GET['filter-timeline']) && $_GET['filter-timeline'] === 'past' ? 'selected' : ''; ?>>Past</option>
            </select>
          </div>
          <?php
        else :
          $tax = get_taxonomy($tax); ?>
          <div class="col-lg-3 col-md-4 col-sm-6">
            <label for="archive-filter-<?= $tax->name; ?>">Filter by <?= $tax->labels->singular_name; ?></label>
            <select id="archive-filter-<?= $tax->name; ?>" name="filter-<?= $tax->name; ?>">
              <option value="">All <?= $tax->label; ?></option>
              <?php
              $terms = get_terms(['taxonomy' => $tax->name]);
              $terms = array_filter($terms, function($term) {
                return $term->parent === 0;
              });
              foreach ($terms as $term) : ?>
                <option value="<?= $term->slug; ?>" <?= isset($_GET['filter-' . $tax->name]) && $_GET['filter-' . $tax->name] === $term->slug ? 'selected' : '' ?>><?= $term->name; ?></option>
                <?php
              endforeach; ?>
            </select>
          </div>
          <?php
        endif;
      endforeach;
      if ($search) :
        $offset = count($filters) === 1 ? 'col-lg-offset-6 col-md-offset-4' : (count($filters) === 2 ? 'col-lg-offset-3' : ''); ?>
        <div class="<?= $offset; ?> col-lg-3 col-md-4 col-sm-6 relative">
          <label for="archive-search"><?= __('Search', '_ws'); ?></label>
          <input id="archive-search" name="search" value="<?= isset($_GET['search']) ? $_GET['search'] : ''; ?>" type="text" />
          <?= do_shortcode('[svg id="search" class="search-icon"]'); ?>
        </div>
        <?php
      endif; ?>
    </div>
  </form>
  <?php
}
