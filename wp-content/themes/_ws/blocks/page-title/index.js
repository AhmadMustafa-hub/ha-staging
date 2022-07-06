/* global React, wp */
const { useSelect } = wp.data
const { RichText } = wp.blockEditor
const { __ } = wp.i18n

export const pageTitle = {
  name: 'ws/page-title',
  args: {
    title: __('Page Title', '_ws'),
    description: __('Same as an H1, but if left empty, defaults to the page title.', '_ws'),
    icon: 'heading',
    category: 'ws-dynamic',
    supports: {
      html: false,
      reusable: false,
      textAlign: true
    },
    attributes: {
      heading: {
        type: 'string'
      }
    },
    edit: props => {
      const { setAttributes } = props
      const { className, heading } = props.attributes
      const { getEditedPostAttribute } = useSelect(select => select('core/editor'))
      return (
        <RichText
          className={ className || '' }
          placeholder={ getEditedPostAttribute('title') || __('Page Title', '_ws') }
          tagName="h1"
          keepPlaceholderOnFocus={ true }
          onChange={ newValue => setAttributes({ heading: newValue }) }
          value={ heading }
        />
      )
    },
    save: props => {
      return null
    }
  }
}
