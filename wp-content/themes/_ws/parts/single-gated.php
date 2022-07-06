<?php
$banner = get_post_meta(get_the_ID(), '_resource_banner_image', true); ?>
<div id="main" class="main single-view">
  <section class="ws-block-section <?= $banner ? 'has-background-image' : ''; ?>">
    <div class="block-background">
      <div <?= _ws_image_background($banner, ['size' => 'large', 'class' => 'block-background-image']); ?>></div>
    </div>
    <div class="container section-container">
      <div class="row section-row">
        <div class="col-xs-12 section-col">
          <div class="wp-block-ws-split">
            <div class="wp-block-ws-split-half block-row col">
              <h1><?= get_the_title(); ?></h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="ws-block-content-sidebar <?= has_post_thumbnail() ? 'padding-top-50' : 'padding-top-0'; ?>">
    <div class="container">
      <div class="row sticky wide-sidebar">
        <main class="col wp-block-ws-main">
          <?php
          the_content();
          echo _ws_get_prev_next(); ?>
        </main>
        <aside class="col wp-block-ws-sidebar">
          <div class="inner-sidebar">
            <?php
            $formHeading = get_post_meta(get_the_ID(), '_resource_form_heading', true) ?: 'Download Now';
            $form = get_post_meta(get_the_ID(), '_resource_form', true);
            if ($form) : ?>
              <div class="wp-block-ws-card card">
                <div class="card-body">
                  <h3><?= $formHeading; ?></h3>
                  <iframe class="wp-block" src="<?= $form; ?>" title="Form"></iframe>
                </div>
              </div>
              <?php
            endif; ?>
          </div>
        </aside>
      </div>
    </div>
  </section>
</div>
