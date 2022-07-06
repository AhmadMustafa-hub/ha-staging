<?php
get_header();

if (have_posts()) :
  while (have_posts()) :
    the_post();
    get_template_part('parts/single', get_post_type());
    // If comments are open or we have at least one comment, load up the comment template.
    // if (comments_open()) {
    //   comments_template();
    // }
  endwhile;
endif;

get_footer(); ?>
