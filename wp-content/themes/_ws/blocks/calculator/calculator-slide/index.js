/* global React, wp */
const { InnerBlocks, RichText } = wp.blockEditor
const { useSelect } = wp.data
const { __ } = wp.i18n

export const calculatorSlide = {
  name: 'ws/calculator-slide',
  args: {
    title: __('Slide', '_ws'),
    icon: 'info-outline',
    category: 'ws-calculator',
    supports: {
      customClassName: false,
      html: false
    },
    parent: ['ws/calculator'],
    attributes: {
      position: {
        type: 'number'
      },
      heading: {
        type: 'string'
      }
    },
    edit: props => {
      const { setAttributes } = props
      const { position, heading } = props.attributes
      const { getBlockIndex, getBlockParents } = useSelect(select => select('core/block-editor'))
      const pos = getBlockIndex(props.clientId, getBlockParents(props.clientId)[0])
      if (position !== pos) {
        setAttributes({ position: pos })
      }
      return (
        <>
          <RichText
            placeholder={ __('Heading', '_ws') }
            tagName="h2"
            onChange={ newValue => setAttributes({ heading: newValue }) }
            value={ heading }
          />
          <InnerBlocks
            templateLock={ false }
          />
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
