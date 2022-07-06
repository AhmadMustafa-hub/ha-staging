<!DOCTYPE html>
<html <?= get_query_var('amp') ? '⚡ ' : ''; ?><?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo('charset'); ?>" />
  <?php wp_head(); ?>
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1" />
  <meta name="theme-color" content="#FFFFFF" />
  <link rel="profile" href="http://gmpg.org/xfn/11" />
</head>

<?php
$bodyClasses = ['no-transitions'];
if (get_post_meta(get_the_ID(), '_header_footer_light_header', true)) {
  array_push($bodyClasses, 'light-header');
}
if (get_post_meta(get_the_ID(), '_header_footer_hide_header', true)) {
  array_push($bodyClasses, 'hide-header');
}
if (get_post_meta(get_the_ID(), '_header_footer_hide_footer', true)) {
  array_push($bodyClasses, 'hide-footer');
} ?>
<body <?php body_class(implode(' ', $bodyClasses)); ?>>
  <?php
  $tag_manager_id = get_option('tag_manager_id');
  if ($tag_manager_id) : ?>
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=<?= $tag_manager_id; ?>"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
    <?php
  endif;
  $bannerText = get_option('banner_text');
  $bannerUID = get_option('banner_uid');
  $cookie = isset($_COOKIE[$bannerUID . 'BannerDismissed']);
  if ($bannerText && !$cookie) : ?>
    <div id="<?= $bannerUID; ?>" class="header-banner">
      <div class="row">
        <div class="col-xs-12 inner-header-banner">
          <p><?= $bannerText; ?></p>
          <button class="header-banner-close">
            <svg viewBox="0 0 24 24"><path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/></svg>
          </button>
        </div>
      </div>
    </div>
    <?php
  endif; ?>
  <div class="site-container test staging">
    <a class="screen-reader-text" href="#main"><?= __('Skip to content', '_ws'); ?></a>
    <header class="site-header header-scroll-top">
      <div class="desktop-nav">
        <div class="desktop-nav-container">
          <div class="logo">
            <?php
            if (_ws_logo()) : ?>
              <a href="<?= esc_url(home_url('/')); ?>" rel="home"><img src="<?= _ws_logo(); ?>" alt="<?= get_bloginfo('name'); ?>" /></a>
              <?php
            endif; ?>
          </div>
          <nav id="desktop-main-menu" class="desktop-menu menu-container">
            <?php
            if (has_nav_menu('header')) {
              wp_nav_menu([
                'theme_location' => 'header',
                'container' => 'div',
                'container_class' => 'header-menu header-primary desktop',
                'walker' => new WS_Walker_Nav_Menu(),
                'item_spacing' => 'discard',
                'link_before' => '<span>',
                'link_after' => '</span>'
              ]);
            } ?>
          </nav>
        </div>
      </div>
      <div class="mobile-nav">
        <div class="mobile-nav-container">
          <div class="logo">
            <?php
            if (_ws_logo()) : ?>
              <a href="<?= esc_url(home_url('/')); ?>" rel="home"><img src="<?= _ws_logo(); ?>" alt="<?php bloginfo('name'); ?>" /></a>
              <?php
            endif; ?>
          </div>
          <button class="hamburger closed" aria-label="<?= __('Toggle Menu', '_ws'); ?>" aria-controls="mobile-main-menu" aria-expanded="false">
            <svg viewBox="0 0 100 100">
              <title><?= __('Toggle Menu', '_ws'); ?></title>
              <path class="closed" d="M10 22 L90 22 M10 50 L90 50 M10 78 L90 78" />
              <path class="opened" d="M20 20 L80 80 Z M80 20 L20 80 Z" />
            </svg>
          </button>
        </div>
        <div class="mobile-nav-menu-container">
          <nav id="mobile-main-menu" class="mobile-menu menu-container">
            <?php
            if (has_nav_menu('header')) {
              wp_nav_menu([
                'theme_location' => 'header',
                'container' => 'div',
                'container_class' => 'header-menu header-primary mobile',
                'walker' => new WS_Walker_Nav_Menu(),
                'item_spacing' => 'discard'
              ]);
            } ?>
          </nav>
        </div>
      </div>
    </header>
