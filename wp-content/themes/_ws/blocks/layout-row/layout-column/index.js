/* global React, wp */
const { InnerBlocks, InspectorControls } = wp.blockEditor
const { PanelBody, SelectControl } = wp.components
const { createHigherOrderComponent } = wp.compose
const { useSelect } = wp.data
const { __ } = wp.i18n

const withLayoutColumnClass = createHigherOrderComponent(BlockListBlock => {
  return props => {
    if (props.name === 'ws/layout-column') {
      return (
        <BlockListBlock { ...props } className={ props.attributes.width ? `col-${props.attributes.width}` : 'col' } />
      )
    }
    return <BlockListBlock { ...props } />
  }
}, 'withLayoutColumnClass')
wp.hooks.addFilter('editor.BlockListBlock', 'ws/with-layout-column-class', withLayoutColumnClass)

export const layoutColumn = {
  name: 'ws/layout-column',
  args: {
    title: __('Layout Column', '_ws'),
    icon: 'info-outline',
    category: 'ws-layout',
    supports: {
      customClassName: false,
      html: false
    },
    parent: ['ws/layout-row'],
    attributes: {
      width: {
        type: 'string'
      }
    },
    edit: props => {
      const { setAttributes } = props
      const { width } = props.attributes
      const { hasChildBlocks } = useSelect(select => ({
        hasChildBlocks: select('core/block-editor').getBlockOrder(props.clientId).length > 0
      }))
      return (
        <>
          <InspectorControls>
            <PanelBody
              title={ __('Layout Column Options', '_ws') }
            >
              <SelectControl
                label={ __('Width', '_ws') }
                options={ [
                  { label: '100%', value: '12' },
                  { label: '2/3', value: '8' },
                  { label: '1/2', value: '6' },
                  { label: '1/3', value: '4' },
                  { label: '1/4', value: '3' },
                  { label: '1/6', value: '2' }
                ] }
                onChange={ newValue => setAttributes({ width: newValue }) }
                value={ width }
              />
            </PanelBody>
          </InspectorControls>
          <InnerBlocks
            renderAppender={ hasChildBlocks ? undefined : () => <InnerBlocks.ButtonBlockAppender /> }
          />
        </>
      )
    },
    save: props => {
      const { width } = props.attributes
      return (
        <div className={ width ? `col-${width}` : 'col' }>
          <InnerBlocks.Content />
        </div>
      )
    }
  }
}
