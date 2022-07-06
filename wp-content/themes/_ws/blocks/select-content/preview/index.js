/* global React, wp */
import PostPreview from 'Components/post-preview.js'
const { __ } = wp.i18n

export const preview = {
  name: 'ws/preview',
  args: {
    title: __('Post Preview', '_ws'),
    icon: 'format-aside',
    category: 'ws-dynamic',
    supports: {
      customClassName: false,
      html: false
    },
    parent: ['ws/select-content'],
    attributes: {
      id: {
        type: 'number'
      }
    },
    edit: props => {
      const { id } = props.attributes
      return (
        <PostPreview
          id={ id }
        />
      )
    },
    save: props => {
      return null
    }
  }
}
