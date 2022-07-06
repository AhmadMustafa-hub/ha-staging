<?php
function _ws_block_content_sidebar($a, $content) {
  $a['className'] = 'ws-block-content-sidebar ' . ($a['className'] ?? '');
  $layout = $a['layout'] ?? '';
  $wideSidebar = isset($a['wideSidebar']) && $a['wideSidebar'] ? 'wide-sidebar' : '';
  $sticky = isset($a['sticky']) && $a['sticky'] ? 'sticky' : '';
  $reverseMobile = isset($a['reverseMobile']) && $a['reverseMobile'] ? 'reverse-mobile' : '';
  ob_start(); ?>
    <div class="row <?= $layout; ?> <?= $sticky; ?> <?= $wideSidebar; ?> <?= $reverseMobile; ?>">
      <?= $content; ?>
    </div>
  <?php
  return _ws_block_wrapping($a, ob_get_clean(), 'div');
}
