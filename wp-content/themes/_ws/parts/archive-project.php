<div class="col-xs-12">
  <div class="card-link archive-view archive-default archive-project">
    <div class="row">
      <div class="col-md-6 col-lg-7 left-side">
        <?php
        if (has_post_thumbnail()) {
          echo _ws_thumbnail(get_the_ID(), ['objectFit' => true, 'class' => 'parallax-bg archive-image', 'size' => 'large']);
        }
        else {
          echo '<div class="parallax-background"><div class="archive-image archive-placeholder"><img src="' .  _ws_logo(true) . '" alt="' . get_bloginfo('name') . '" /></div></div>';
        } ?>
      </div>
      <div class="col-md-6 col-lg-5 right-side">
        <?php
        $company = get_post_meta(get_the_ID(), '_project_company', true);
        $location = get_post_meta(get_the_ID(), '_project_location', true); ?>
        <p class="subhead no-margin"><?= implode('&nbsp;&middot;&nbsp;', array_filter([$company, $location])); ?></p>
        <div class="title-excerpt">
          <h3 class="post-title"><?= _ws_get_link(get_the_ID()); ?></h3>
        </div>
        <p class="button-simple"><?= __('View', '_ws') . ' ' . _ws_get_post_type_label(); ?></p>
      </div>
    </div>
  </div>
</div>
