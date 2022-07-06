<?php
function _ws_block_form($a, $content) {
  $a['className'] = 'wp-block-ws-form ' . ($a['className'] ?? '');
  $form = $a['form'] ?? '';
  $content = preg_replace('/<p>[\t\r\n\s]*<\/p>/', '', $content);
  ob_start();
    echo $form;
    echo '<div class="form-msg">' . base64_encode(trim($content)) . '</div>';
  return _ws_block_wrapping($a, ob_get_clean(), 'div');
}
