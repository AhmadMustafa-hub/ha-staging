<?php
$parent = wp_get_post_parent_id(get_the_ID()); ?>
<div class="col-xs-12 no-padding">
  <div class="archive-view archive-page">
    <div class="left-side">
      <div class="title-excerpt">
        <h3 class="post-title"><?= get_the_title(); ?></h3>
        <?= has_excerpt() ? '<p class="post-excerpt">' . get_the_excerpt() . '</p>' : ''; ?>
      </div>
      <a class="button-simple" href="<?= the_permalink(); ?>"><?= rtrim(get_the_title($parent), 's'); ?> <?= __('Overview', '_ws'); ?></a>
    </div>
    <div class="right-side has-white-color has-lake-background-color">
      <div <?= _ws_thumbnail_background(get_the_ID(), ['class' => 'parallax-bg', 'size' => 'full']); ?>></div>
      <?php
      $ps = get_posts([
        'post_parent' => get_the_ID(),
        'post_type' => get_post_type(),
        'posts_per_page' => -1
      ]);
      if (count($ps)) {
        echo _ws_block_children(['className' => 'is-style-list', 'allPosts' => true]);
      } ?>
    </div>
  </div>
</div>
