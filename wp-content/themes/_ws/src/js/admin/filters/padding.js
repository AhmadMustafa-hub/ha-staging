/* globals React, wp */
const { InspectorControls } = wp.blockEditor
const { hasBlockSupport } = wp.blocks
const { PanelBody, SelectControl } = wp.components
const { createHigherOrderComponent } = wp.compose
const { __ } = wp.i18n

export const paddingControls = {
  hook: 'editor.BlockEdit',
  name: 'ws/with-padding-controls',
  func: createHigherOrderComponent(BlockEdit => {
    return props => {
      if (!props.name.startsWith('ws/')) {
        return <BlockEdit { ...props } />
      }
      const supportsPadding = hasBlockSupport(props.name, 'padding')
      const { setAttributes } = props
      const { paddingTop, paddingBottom } = props.attributes
      return (
        <>
          { !!supportsPadding && (
            <InspectorControls>
              <PanelBody
                title={ __('Padding Settings', '_ws') }
              >
                <div className="padding">
                  <SelectControl
                    label={ __('Top', '_ws') }
                    options={ [
                      { label: '-100%', value: '-100' },
                      { label: '-50%', value: '-50' },
                      { label: '0%', value: '0' },
                      { label: '50%', value: '50' },
                      { label: '100%', value: '100' },
                      { label: '150%', value: '150' },
                      { label: '200%', value: '200' }
                    ] }
                    onChange={ newValue => setAttributes({ paddingTop: newValue }) }
                    value={ paddingTop }
                  />
                  <SelectControl
                    label={ __('Bottom', '_ws') }
                    options={ [
                      { label: '200%', value: '200' },
                      { label: '150%', value: '150' },
                      { label: '100%', value: '100' },
                      { label: '50%', value: '50' },
                      { label: '0%', value: '0' },
                      { label: '-50%', value: '-50' },
                      { label: '-100%', value: '-100' }
                    ] }
                    onChange={ newValue => setAttributes({ paddingBottom: newValue }) }
                    value={ paddingBottom }
                  />
                </div>
              </PanelBody>
            </InspectorControls>
          ) }
          <BlockEdit { ...props } />
        </>
      )
    }
  })
}

export const paddingAttributes = {
  hook: 'blocks.registerBlockType',
  name: 'ws/with-padding-attributes',
  func: (props, name) => {
    if (name.startsWith('ws/')) {
      props.attributes = {
        ...props.attributes,
        paddingTop: {
          type: 'string',
          default: '100'
        },
        paddingBottom: {
          type: 'string',
          default: '100'
        }
      }
    }
    return props
  }
}
