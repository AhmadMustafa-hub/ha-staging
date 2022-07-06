<?php
function _ws_block_kpi($a) {
  $a['className'] = 'wp-block-ws-kpi ' . ($a['className'] ?? '');
  $kpi = $a['kpi'] ?? '';
  $label = $a['label'] ?? '';
  $animate = $a['animate'] ?? false;
  $textAlign = isset($a['textAlign']) && $a['textAlign'] ? 'has-text-align-' . $a['textAlign'] : '';
  $a['className'] .= $textAlign;
  ob_start(); ?>
    <p class="kpi-value">
      <span <?= $animate ? 'class="count" data-count="' . str_replace(',', '', $kpi) . '"' : ''; ?>>
        <?= $animate ? 0 : $kpi; ?>
      </span>
    </p>
    <p class="kpi-label"><?= $label; ?></p>
  <?php
  return _ws_block_wrapping($a, ob_get_clean(), 'div');
}
