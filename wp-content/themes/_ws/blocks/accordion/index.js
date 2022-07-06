/* global React, wp */
const { InnerBlocks, RichText } = wp.blockEditor
const { __ } = wp.i18n

export const accordion = {
  name: 'ws/accordion',
  args: {
    title: __('Accordion', '_ws'),
    description: __('Collapsible content.', '_ws'),
    icon: 'feedback',
    category: 'ws-bit',
    supports: {
      anchor: true
    },
    attributes: {
      heading: {
        type: 'string'
      }
    },
    edit: props => {
      const { setAttributes } = props
      const { heading } = props.attributes
      return (
        <>
          <RichText
            placeholder={ __('Heading', '_ws') }
            tagName="h3"
            keepPlaceholderOnFocus={ true }
            onChange={ newValue => setAttributes({ heading: newValue }) }
            value={ heading }
          />
          <div className="accordion-panel">
            <InnerBlocks
              templateLock={ false }
            />
          </div>
        </>
      )
    },
    save: props => {
      return (
        <InnerBlocks.Content />
      )
    }
  }
}
