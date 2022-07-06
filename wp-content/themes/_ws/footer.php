    <footer class="row site-footer">
      <div id="footer-form" class="col-lg-6 footer-left has-white-color">
        <div class="parallax-bg footer-image lazy-load" data-src="/wp-content/themes/_ws/assets/footer_bg.jpg"></div>
        <?php
        if (is_active_sidebar('footer-left')) : ?>
          <ul class="footer-widgets">
            <?php dynamic_sidebar('footer-left'); ?>
          </ul>
          <?php
        endif; ?>
      </div>
      <div class="col-lg-6 footer-right">
        <?php
        if (has_nav_menu('footer')) {
          wp_nav_menu([
            'theme_location' => 'footer',
            'container' => 'div',
            'container_class' => 'footer-top',
            'item_spacing' => 'discard'
          ]);
        } ?>
        <hr />
        <div class="footer-bottom row">
          <div class="col-sm-6">
            <?= do_shortcode('[logo light=1 link=1]'); ?>
            <?= do_shortcode('[social_links icons="linkedin,twitter,facebook"]'); ?>
          </div>
          <div class="col-sm-6 has-text-align-right">
            <p><b>Corporate Office</b></p>
            <?= do_shortcode('[address phone=1]'); ?>
          </div>
        </div>
        <div class="footer-legal">
          <p>&copy; <?= do_shortcode('[year]'); ?> Haley &amp; Aldrich | All rights reserved</p>
          <?php
          if (has_nav_menu('footer-legal')) {
            wp_nav_menu([
              'theme_location' => 'footer-legal',
              'container' => 'div',
              'container_class' => 'footer-legal-menu',
              'item_spacing' => 'discard'
            ]);
          } ?>
        </div>
      </div>
    </footer>
    <?php
    wp_footer(); ?>
  </div>
</body>
</html>
