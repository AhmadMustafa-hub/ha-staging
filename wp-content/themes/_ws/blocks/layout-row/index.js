/* global React, wp */
import { layoutColumn } from './layout-column/index.js'
const { PanelBody, SelectControl } = wp.components
const { InnerBlocks, InspectorControls } = wp.blockEditor
const { __ } = wp.i18n

export const layoutRow = {
  name: 'ws/layout-row',
  args: {
    title: __('Layout Row', '_ws'),
    description: __('Define columns and add content.', '_ws'),
    icon: 'editor-table',
    category: 'ws-layout',
    supports: {
      anchor: true
    },
    attributes: {
      alignment: {
        type: 'string'
      }
    },
    edit: props => {
      const { setAttributes } = props
      const { alignment } = props.attributes
      return (
        <>
          <InspectorControls>
            <PanelBody
              title={ __('Layout Row Options', '_ws') }
            >
              <SelectControl
                label={ __('Vertical Alignment', '_ws') }
                options={ [
                  { label: 'Top', value: 'start' },
                  { label: 'Center', value: 'center' },
                  { label: 'Bottom', value: 'end' }
                ] }
                onChange={ newValue => setAttributes({ alignment: newValue }) }
                value={ alignment }
              />
            </PanelBody>
          </InspectorControls>
          <div className={ `block-row ${alignment ? `align-items-${alignment}` : ''}` }>
            <InnerBlocks
              allowedBlocks={ ['ws/layout-column'] }
              template={ [
                ['ws/layout-column', { width: '4' }]
              ] }
            />
          </div>
        </>
      )
    },
    save: props => {
      const { alignment } = props.attributes
      return (
        <div className={ `row ${alignment ? `align-items-${alignment}` : ''}` }>
          <InnerBlocks.Content />
        </div>
      )
    }
  },
  innerBlocks: [layoutColumn]
}
