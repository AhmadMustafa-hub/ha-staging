<?php
class NewsMeta extends PostMeta {

}

new NewsMeta('News', [
  'plural' => 'News',
  'template' => [
    ['core/paragraph', ['placeholder' => 'News have their own template, so you only need to type the content of the post. Don\'t forget the featured image.']]
  ],
  'dashicon' => 'dashicons-megaphone',
  'url' => 'resources/news'
]);
