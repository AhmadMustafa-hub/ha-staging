/* global React, wp */
import { splitHalf } from './split-half/index.js'
const { InnerBlocks, InspectorControls } = wp.blockEditor
const { PanelBody, SelectControl, ToggleControl } = wp.components
const { __ } = wp.i18n

export const split = {
  name: 'ws/split',
  args: {
    title: __('Split', '_ws'),
    description: __('Two columns of content with optional variations.', '_ws'),
    icon: 'image-flip-horizontal',
    category: 'ws-layout',
    supports: {
      anchor: true
    },
    attributes: {
      alignment: {
        type: 'string'
      },
      variant: {
        type: 'string'
      },
      padding: {
        type: 'boolean'
      },
      desktopReverse: {
        type: 'boolean'
      }
    },
    edit: props => {
      const { setAttributes } = props
      const { alignment, variant, padding, desktopReverse } = props.attributes
      return (
        <>
          <InspectorControls>
            <PanelBody
              title={ __('Split Options', '_ws') }
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
              <SelectControl
                label={ __('Layout', '_ws') }
                options={ [
                  { label: '50/50', value: '' },
                  { label: '40/60', value: 'large-right' },
                  { label: '60/40', value: 'large-left' }
                ] }
                onChange={ newValue => setAttributes({ variant: newValue }) }
                value={ variant }
              />
              <ToggleControl
                label={ __('Padding Between', '_ws') }
                onChange={ newValue => setAttributes({ padding: newValue }) }
                checked={ padding }
              />
              <ToggleControl
                label={ __('Reverse halves on desktop', '_ws') }
                onChange={ newValue => {
                  // if (variant === 'large-left') {
                  //   setAttributes({ variant: 'large-right' })
                  // }
                  // else if (variant === 'large-right') {
                  //   setAttributes({ variant: 'large-left' })
                  // }
                  setAttributes({ desktopReverse: newValue })
                } }
                checked={ desktopReverse }
              />
            </PanelBody>
          </InspectorControls>
          <div className={ `block-row has-2-columns ${alignment ? `align-items-${alignment}` : ''} ${variant ? `variant-${variant}` : ''} ${padding ? 'split-padding' : ''} ${desktopReverse ? 'row-reverse' : ''}` }>
            <InnerBlocks
              allowedBlocks={ ['ws/split-half'] }
              templateLock='all'
              template={ [
                ['ws/split-half'],
                ['ws/split-half']
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
  innerBlocks: [splitHalf]
}
