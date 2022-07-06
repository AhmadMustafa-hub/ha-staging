<div class="col-md-6 col-lg-4 slide">
    <div class="card-link archive-view archive-default archive-project-slides">
        <?php
    if (has_post_thumbnail()) {
     $src= get_the_post_thumbnail_url();
      echo "<img class='project-image' size='medium' data-object-fit='cover' data-object-position  src='".$src."'>";
      // echo '<div class="archive-image">' . _ws_thumbnail(get_the_ID(), ['objectFit' => true, 'class' => 'parallax-bg', 'size' => 'medium']) . '</div>';
    }
    else {
      echo '<div class="archive-image"><div class="parallax-background"><div class="archive-placeholder"><img src="' .  _ws_logo(true) . '" alt="' . get_bloginfo('name') . '" /></div></div></div>';
    } ?>
        <div class="archive-body">
            <h3 class=" no-margin project-title"><?=get_the_title($id); ?></h3>
            <div class="title-excerpt">
                <p class="post-title"><a href="<?=get_permalink(get_the_ID()); ?>" class="project-link">View Project</a>
                </p>
            </div>
        </div>
    </div>
</div>