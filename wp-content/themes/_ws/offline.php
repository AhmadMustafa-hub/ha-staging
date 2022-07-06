<?php
get_header(); ?>

<main id="main" template="offline">
  <section>
    <div class="container">
      <div class="row">
        <div class="col-lg-10 col-xl-8">
          <?= do_shortcode('[svg id="wifi"]'); ?>
          <h1 class="page-title"><?= __('Offline', '_ws'); ?></h1>
          <p><?= __('We are unable to complete your request without a network connection. Please try again once you have reestablished connectivity.', '_ws'); ?></p>
        </div>
      </div>
    </div>
  </section>
</main>

<?php
get_footer(); ?>
