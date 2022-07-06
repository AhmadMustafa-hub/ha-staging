/* global React, wp */
import { main } from './main/index.js'
import { sidebar } from './sidebar/index.js'
const { PanelBody, SelectControl, ToggleControl } = wp.components
const { InnerBlocks, InspectorControls } = wp.blockEditor
const { __ } = wp.i18n

export const contentSidebar = {
  name: 'ws/content-sidebar',
  args: {
    title: __('Content & Sidebar', '_ws'),
    description: __('Main content with secondary sidebar.', '_ws'),
    icon: 'table-col-after',
    category: 'ws-layout',
    supports: {
      anchor: true,
      backgroundColor: true,
      textColor: true,
      padding: true
    },
    attributes: {
      layout: {
        type: 'string'
      },
      wideSidebar: {
        type: 'boolean'
      },
      sticky: {
        type: 'boolean'
      },
      reverseMobile: {
        type: 'boolean'
      }
    },
    edit: props => {
      const { setAttributes } = props
      const { layout, wideSidebar, sticky, reverseMobile } = props.attributes
      return (
        <>
          <InspectorControls>
            <PanelBody
              title={ __('Sidebar Options', '_ws') }
            >
              <SelectControl
                label={ __('Layout', '_ws') }
                options={ [
                  { label: 'Sidebar Right', value: 'sidebar-right' },
                  { label: 'Sidebar Left', value: 'sidebar-left' }
                ] }
                onChange={ newValue => setAttributes({ layout: newValue }) }
                value={ layout }
              />
              <ToggleControl
                label={ __('Wide sidebar', '_ws') }
                onChange={ newValue => setAttributes({ wideSidebar: newValue }) }
                checked={ wideSidebar }
              />
              <ToggleControl
                label={ __('Sticky sidebar', '_ws') }
                onChange={ newValue => setAttributes({ sticky: newValue }) }
                checked={ sticky }
              />
              <ToggleControl
                label={ __('Sidebar first on mobile', '_ws') }
                onChange={ newValue => setAttributes({ reverseMobile: newValue }) }
                checked={ reverseMobile }
              />
            </PanelBody>
          </InspectorControls>
          <div className={ `block-row has-2-columns ${layout === 'sidebar-left' ? 'row-reverse' : ''}` }>
            <InnerBlocks
              allowedBlocks={ ['ws/main', 'ws/sidebar'] }
              templateLock='all'
              template={ [
                ['ws/main'],
                ['ws/sidebar']
              ] }
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
  },
  innerBlocks: [main, sidebar]
}
