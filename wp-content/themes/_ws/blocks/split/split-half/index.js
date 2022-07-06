/* global React, wp */
const { useSelect } = wp.data
const { InnerBlocks, InspectorControls } = wp.blockEditor
const { PanelBody, ToggleControl } = wp.components
const { __ } = wp.i18n

export const splitHalf = {
  name: 'ws/split-half',
  args: {
    title: __('Split Half', '_ws'),
    icon: 'info-outline',
    category: 'ws-layout',
    supports: {
      customClassName: false,
      html: false
    },
    parent: ['ws/split'],
    attributes: {
      overflowTop: {
        type: 'boolean'
      },
      overflowBottom: {
        type: 'boolean'
      }
    },
    edit: props => {
      const { setAttributes } = props
      const { overflowTop, overflowBottom } = props.attributes
      const { hasChildBlocks } = useSelect(select => ({
        hasChildBlocks: select('core/block-editor').getBlockOrder(props.clientId).length > 0
      }))
      return (
        <>
          <InspectorControls>
            <PanelBody
              title={ __('Split Half Options', '_ws') }
            >
              <ToggleControl
                label={ __('Overflow Top', '_ws') }
                onChange={ newValue => setAttributes({ overflowTop: newValue }) }
                checked={ overflowTop }
              />
              <ToggleControl
                label={ __('Overflow Bottom', '_ws') }
                onChange={ newValue => setAttributes({ overflowBottom: newValue }) }
                checked={ overflowBottom }
              />
            </PanelBody>
          </InspectorControls>
          <InnerBlocks
            templateLock={ false }
            renderAppender={ hasChildBlocks ? undefined : () => <InnerBlocks.ButtonBlockAppender /> }
          />
        </>
      )
    },
    save: props => {
      return (
        <InnerBlocks.Content />
      )
    },
    deprecated: [
      {
        migrate: (attributes, innerBlocks) => {
          return [attributes, innerBlocks]
        },
        save: props => {
          return (
            <div className="col">
              <InnerBlocks.Content />
            </div>
          )
        }
      }
    ]
  }
}
