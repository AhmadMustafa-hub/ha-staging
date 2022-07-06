<?php
class PublicationMeta extends PostMeta {

}

new PublicationMeta('Publication', [
  'template' => [
    ['core/paragraph', ['placeholder' => 'Publications have their own template, so you only need to type the content of the post. Don\'t forget meta and featured image.']]
  ],
  'dashicon' => 'dashicons-media-document',
  'url' => 'resources/publications'
]);

class LinkTaxonomy extends Taxonomy {

  public function __construct($singular, $args) {
    parent::__construct($singular, $args);
    add_action($this->slug . '_add_form_fields', [$this, '_ws_add_taxonomy_meta_field']);
    add_action($this->slug . '_edit_form_fields', [$this, '_ws_edit_taxonomy_meta_field']);
    add_action('edited_' . $this->slug, [$this, '_ws_save_taxonomy_meta']);
    add_action('created_' . $this->slug, [$this, '_ws_save_taxonomy_meta']);
  }

  public function _ws_add_taxonomy_meta_field($taxonomy) { ?>
    <div class="form-field">
      <label for="term-link"><?= __('Add Link', '_ws'); ?></label>
      <input id="term-link" type="text" name="term-link" value="">
      <p class="description"><?= __('This is where the tag will link when displayed on a post.', '_ws'); ?></p>
    </div>
    <?php
  }

  public function _ws_edit_taxonomy_meta_field($term) {
    $meta_value = get_term_meta($term->term_id, 'term-link', true); ?>
    <tr class="form-field term-group-wrap">
      <th scope="row">
        <label for="term-link"><?= __('Link', '_ws'); ?></label>
      </th>
      <td>
        <input id="term-link" type="text" name="term-link" value="<?= $meta_value; ?>">
        <p class="description"><?= __('This is where the tag will link when displayed on a post.', '_ws'); ?></p>
      </td>
    </tr>
    <?php
  }

  public function _ws_save_taxonomy_meta($term_id) {
    if (isset($_POST['term-link']) && $_POST['term-link']) {
      update_term_meta($term_id, 'term-link', $_POST['term-link']);
    }
  }

}

new LinkTaxonomy('Market', [
  'post_types' => ['project', 'publication', 'post', 'person', 'news'],
  'description' => 'Taxonomy for several post types.'
]);
new LinkTaxonomy('Service', [
  'post_types' => ['project', 'publication', 'post', 'person', 'news'],
  'description' => 'Taxonomy for several post types.'
]);
