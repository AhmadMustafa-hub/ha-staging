<?php
function _ws_block_person($a) {
  $a['className'] = 'wp-block-ws-person ' . ($a['className'] ?? '');
  $personType = $a['personType'] ?? '';
  $personId = $a['personId'] ?? 0;
  $personImage = $a['personImage'] ?? '';
  $personName = $a['personName'] ?? '';
  $personTitle = $a['personTitle'] ?? '';
  $personEmail = $a['personEmail'] ?? '';
  $personTwitter = $a['personTwitter'] ?? '';
  $postStatus = get_post_status($personId);
  $position = get_post_meta($personId, '_person_position', true);
  $linkedin = get_post_meta($personId, '_person_linkedin', true);
  $email = get_post_meta($personId, '_person_email', true);
  ob_start();
    if ($personType === 'team') :
      if ($postStatus === 'publish') : ?>
        <?= _ws_thumbnail($personId, ['class' => 'person-image', 'size' => 'thumbnail']) ?: '<div class="placeholder"></div>'; ?>
        <div class="person-info">
          <?= _ws_get_link($personId, ['class' => 'button-simple']); ?>
          <?= $position ? '<p>' . $position . '</p>' : ''; ?>
          <?php
          if ($linkedin || $email) {
            $links = ['linkedin' => $linkedin, 'email' => $email];
            echo '<div class="social-links">';
              foreach ($links as $icon => $link) {
                echo '<a href="' . ($icon === 'email' ? 'mailto:' : '') . $link . '" target="_blank" rel="noopener">' . do_shortcode('[svg id="' . $icon . '"]') . '</a>';
              }
            echo '</div>';
          } ?>
        </div>
        <?php
      else : ?>
        <div class="object-fit-container"></div>
        <div class="person-info">
          <p><b>Haley & Aldrich</b></p>
        </div>
        <?php
      endif;
    elseif ($personType === 'custom') : ?>
      <?= _ws_image($personImage, ['class' => 'person-image', 'size' => 'thumbnail']) ?: '<div class="placeholder"></div>'; ?>
      <div class="person-info">
        <?php
        echo $personName ? '<p class="button-simple">' . $personName . '</p>' : '';
        echo $personTitle ? '<p>' . $personTitle . '</p>' : '';
        if ($personEmail || $personTwitter) : ?>
          <div class="social-links">
            <?= $personEmail ? '<a href="mailto:' . $personEmail . '" target="_blank" rel="noopener noreferer">' . do_shortcode('[svg id="email"]') . '</a>' : ''; ?>
            <?= $personTwitter ? '<a href="' . $personTwitter . '" target="_blank" rel="noopener noreferer">' . do_shortcode('[svg id="twitter"]') . '</a>' : ''; ?>
          </div>
          <?php
        endif; ?>
      </div>
      <?php
    endif; ?>
  <?php
  return _ws_block_wrapping($a, ob_get_clean(), 'div');
}
