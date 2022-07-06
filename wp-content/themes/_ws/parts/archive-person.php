<div class="col-sm-6 col-md-4 col-lg-3">
  <div class="card-link archive-view archive-default archive-<?= get_post_type(); ?>">
    <?php
    if (has_post_thumbnail()) {
      echo '<div class="archive-image">' . _ws_thumbnail(get_the_ID(), ['objectFit' => true, 'class' => 'parallax-bg', 'size' => 'medium']) . '</div>';
    }
    else {
      echo '<div class="archive-image"><div class="parallax-background"><div class="archive-placeholder"><img src="' .  _ws_logo(true) . '" alt="' . get_bloginfo('name') . '" /></div></div></div>';
    } ?>
    <div class="archive-body">
      <div class="title-excerpt">
        <h3 class="post-title"><?= _ws_get_link(get_the_ID()); ?>[svg id="caret-right" class="has-moss-color"]</h3>
      </div>
      <?php
      $position = get_post_meta(get_the_ID(), '_person_position', true);
      echo $position ? '<p class="subhead">' . $position . '</p>' : ''; ?>
    </div>
  </div>
</div>
