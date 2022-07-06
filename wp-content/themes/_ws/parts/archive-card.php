<div class="col-lg-4 col-md-6">
  <div class="card card-link archive-view archive-card archive-card-<?= get_post_type(); ?>">
    <?php
    if (has_post_thumbnail()) {
      echo '<div class="archive-image">' . _ws_thumbnail(get_the_ID(), ['objectFit' => true, 'class' => 'parallax-bg', 'size' => 'medium']) . '</div>';
    }
    else {
      echo '<div class="archive-image"><div class="parallax-background"><div class="archive-placeholder"><img src="' .  _ws_logo(true) . '" alt="' . get_bloginfo('name') . '" /></div></div></div>';
    } ?>
    <div class="archive-body">
      <p class="subhead no-margin"><?= _ws_get_post_type_label(); ?></p>
      <div class="title-excerpt">
        <h3 class="post-title"><?= _ws_get_link(get_the_ID()); ?>[svg id="caret-right" class="has-moss-color"]</h3>
      </div>
    </div>
  </div>
</div>
