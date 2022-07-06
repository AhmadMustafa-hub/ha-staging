<div id="main" class="main single-view single-person">
  <section class="ws-block-section is-style-slim has-text-color has-blue-background-gradient has-white-color padding-top-50 padding-bottom-50">
    <div class="block-background">
      <img class="geometric-shape-top-right" src="/wp-content/themes/_ws/assets/geometric.svg" alt="Geometric Decoration" />
    </div>
    <div class="container section-container">
      <div class="row section-row">
        <div class="col-xs-12 section-col">
          <div class="row align-items-center">
            <div class="wp-block col image-col">
              <?= _ws_thumbnail(get_the_ID(), ['objectFit' => true, 'class' => 'person-image parallax']); ?>
            </div>
            <div class="col heading-col">
              <?php
              $suffixes = get_post_meta(get_the_ID(), '_person_suffixes', true);
              $position = get_post_meta(get_the_ID(), '_person_position', true);
              echo '<h1>' . get_the_title() . ($suffixes ? ', ' . $suffixes : '') . '</h1>';
              echo $position ? '<p>' . $position . '</p>' : ''; ?>
            </div>
          </div>
          <div class="row">
            <div class="col image-col">
              <?php
              $linkedin = get_post_meta(get_the_ID(), '_person_linkedin', true);
              $email = get_post_meta(get_the_ID(), '_person_email', true);
              $twitter = get_post_meta(get_the_ID(), '_person_twitter', true);
              $googleScholar = get_post_meta(get_the_ID(), '_person_google_scholar', true);
              if ($linkedin || $email || $twitter || $googleScholar) {
                echo '<div class="wp-block links">';
                  $links = array_filter(['linkedin' => $linkedin, 'email' => $email, 'twitter' => $twitter, 'google-scholar' => $googleScholar], function($link) {
                    return $link;
                  });
                  foreach ($links as $svg => $link) {
                    echo '<a href="' . ($svg === 'email' ? 'mailto:' : '') . $link . '" target="_blank" rel="noopener">' . do_shortcode('[svg id="' . $svg . '" class="has-white-color"]') . '</a>';
                  }
                echo '</div>';
              } ?>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="ws-block-section is-style-narrow">
    <div class="block-background"></div>
    <div class="container section-container">
      <div class="row section-row">
        <main class="col-xs-12 section-col">
          <?php
          the_content();
          $archiveURL = '/' . get_post_type_object(get_post_type())->rewrite['slug'] . '/'; ?>
          <div class="wp-block">
            <a href="<?= $archiveURL; ?>" class="button-simple"><?= __('Back to Our People', '_ws'); ?></a>
          </div>
        </main>
      </div>
    </div>
  </section>
  <?php
  $resources = get_post_meta(get_the_ID(), '_person_resources', true) ?: [];
  if (count($resources)) : ?>
    <section class="ws-block-section padding-top-0">
      <div class="block-background"></div>
      <div class="container section-container">
        <div class="row section-row">
          <div class="col-xs-12 section-col">
            <?php
            $leftSplit = '<div class="wp-block-ws-split-half col"><h2>Related Resources</h2></div>';
            $rightSplit = '<div class="wp-block-ws-split-half col"></div>';
            echo _ws_block_split(['alignment' => 'center', 'variant' => 'large-left'], $leftSplit . $rightSplit);
            echo do_shortcode(_ws_block_select_content(['ids' => $resources])); ?>
          </div>
        </div>
      </div>
    </section>
    <?php
  endif; ?>
</div>
