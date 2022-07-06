<?php
get_header(); ?>

<main id="main" class="archive archive-post" template="archive-post">
  <?php
  get_template_part('parts/banner');
  if (have_posts()) : ?>
    <section>
      <div class="container">
        <div class="row infinite-scroll-button">
          <?php
          while (have_posts()) : the_post();
            get_template_part('parts/archive', get_post_type());
          endwhile; ?>
        </div>
      </div>
    </section>
    <?php
  endif; ?>
</main>

<?php
get_footer();
