<div <?= _ws_thumbnail_background(get_the_ID(), ['class' => 'archive-view archive-tile card-link square', 'size' => 'medium']); ?>>
  <div class="tile-content">
    <h3 class="post-title"><?= _ws_get_link(get_the_ID()); ?></h3>
    <?= has_excerpt() ? '<p class="post-excerpt">' . get_the_excerpt() . '</p>' : ''; ?>
  </div>
</div>
