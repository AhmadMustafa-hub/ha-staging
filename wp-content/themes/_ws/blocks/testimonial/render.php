<?php
function _ws_block_testimonial($a) {
  $a['className'] = 'wp-block-ws-testimonial ' . ($a['className'] ?? '');
  $image = $a['image'] ?? '';
  $quote = $a['quote'] ?? '';
  $citation = $a['citation'] ?? '';
  $link = $a['link'] ?? ['url' => '', 'opensInNewTab' => false];
  ob_start(); ?>
    <blockquote>
      <?= $image ? _ws_image($image, ['class' => 'quote-image', 'size' => 'small']) : ''; ?>
      <div class="quote-citation">
        <p class="quote"><?= $quote; ?></p>
        <?php
        $citation = $citation ? '<cite>' . $citation . '</cite>' : '';
        echo $link['url'] ? '<a class="cite-link" href="' . $link['url'] . '" ' . ($link['opensInNewTab'] ? 'target="_blank" rel="noopener"' : '') . '>' . $citation . '</a>' : $citation; ?>
      </div>
    </blockquote>
  <?php
  return _ws_block_wrapping($a, ob_get_clean(), 'div');
}
