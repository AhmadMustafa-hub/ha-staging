<?php
function _ws_block_icon($a, $content) {
  $a['className'] = 'ws-block-icon ' . ($a['className'] ?? '');
  $icon = $a['icon'] ?? '';
  $size = $a['size'] ?? 'artboard';
  $iconColor = isset($a['iconColor']) ? _ws_get_color_slug($a['iconColor']) : '';
  $iconBackgroundColor = isset($a['iconBackgroundColor']) ? _ws_get_color_slug($a['iconBackgroundColor']) : '';
  $text = $a['text'] ?? false;
  $textAlign = isset($a['textAlign']) && $a['textAlign'] ? 'has-text-align-' . $a['textAlign'] : '';
  $a['className'] .= $textAlign;
  $iconClasses = ['size-' . $size];
  if ($iconColor) {
    array_push($iconClasses, 'has-' . $iconColor . '-color');
  }
  if ($text) {
    $a['className'] .= ' icon-text-' . $text;
  }
  ob_start(); ?>
    <div class="<?= $a['className']; ?>">
      <div class="icon-svg <?= $iconBackgroundColor ? 'has-background-color has-' . $iconBackgroundColor . '-background-color' : '' ?>">
        <?= '[svg id="' . $icon . '" class="' . implode(' ', $iconClasses) . '"]'; ?>
      </div>
      <?php
      if ($text) : ?>
        <div class="icon-text">
          <?= $content; ?>
        </div>
        <?php
      endif; ?>
    </div>
  <?php
  return ob_get_clean();
}
