/* global React, wp */
const { InnerBlocks, InspectorControls } = wp.blockEditor
const { PanelBody, SelectControl } = wp.components
const { __ } = wp.i18n

export const tile = {
  name: 'ws/tile',
  args: {
    title: __('Tile', '_ws'),
    icon: 'format-aside',
    category: 'ws-layout',
    supports: {
      html: false,
      textColor: true,
      background: true
    },
    parent: ['ws/tiles'],
    attributes: {
      size: {
        type: 'string'
      }
    },
    edit: props => {
      const { setAttributes } = props
      const { size } = props.attributes
      return (
        <>
          <InspectorControls>
            <PanelBody
              title={ __('Tile Options', '_ws') }
            >
              <SelectControl
                label={ __('Size', '_ws') }
                options={ [
                  { label: '1x1', value: 'one-one' },
                  { label: '1x2', value: 'one-two' },
                  { label: '2x1', value: 'two-one' },
                  { label: '2x2', value: 'two-two' }
                ] }
                onChange={ newValue => setAttributes({ size: newValue }) }
                value={ size }
              />
            </PanelBody>
          </InspectorControls>
          <div className="tile">
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
