<?php
get_header(); ?>

<main id="main" class="main" template="search">
  <section class="ws-block-section padding-top-50 padding-bottom-50">
    <div class="block-background"></div>
    <div class="container section-container">
      <div class="row section-row">
        <div class="col-lg-10 col-xl-8 section-col">
          <h1><?= sprintf(__('Search Results: <span>%s</span>', '_ws'), get_search_query()); ?></h1>
          <form class="wp-block-search archive-filters" role="search" method="get" action="/">
            <label for="wp-block-search__input" class="wp-block-search__label">Search</label>
            <input type="search" id="wp-block-search__input" class="wp-block-search__input" name="s" value="<?= $_GET['s'] ?? ''; ?>" placeholder="">
            <button type="submit" class="wp-block-search__button">Search</button>
          </form>
        </div>
      </div>
    </div>
  </section>
  <section class="padding-top-50 padding-bottom-50">
    <div class="block-background"></div>
    <div class="container">
      <div class="row archive-results" type="card">
      </div>
    </div>
  </section>
</main>

<?php
get_footer(); ?>
