/* global React, wp */
import MediaPreview from 'Components/media-preview.js'
import MediaSelect from 'Components/media-select.js'
const { InnerBlocks, InspectorControls } = wp.blockEditor
const { PanelBody, SelectControl, ToggleControl } = wp.components
const { __ } = wp.i18n

export const card = {
  name: 'ws/card',
  args: {
    title: __('Card', '_ws'),
    description: __('Wrap content in card styling.', '_ws'),
    icon: 'format-aside',
    category: 'ws-bit',
    supports: {
      anchor: true
    },
    attributes: {
      padding: {
        type: 'boolean'
      },
      image: {
        type: 'number'
      },
      imageX: {
        type: 'number',
        default: 0.5
      },
      imageY: {
        type: 'number',
        default: 0.5
      },
      imagePosition: {
        type: 'string'
      }
    },
    edit: props => {
      const { setAttributes } = props
      const { className, padding, image, imageX, imageY, imagePosition } = props.attributes
      return (
        <>
          <InspectorControls>
            <PanelBody
              title={ __('Card Options', '_ws') }
            >
              <ToggleControl
                label={ __('Extra Padding', '_ws') }
                onChange={ newValue => setAttributes({ padding: newValue }) }
                checked={ padding }
              />
              <MediaSelect
                label={ __('Image', '_ws') }
                onChange={ ({ id, focalPoint }) => setAttributes({ image: id, imageX: focalPoint.x, imageY: focalPoint.y }) }
                id={ image }
                focalPoint={ {
                  x: imageX,
                  y: imageY
                } }
              />
              { !!image && (
                <SelectControl
                  label={ __('Image Position', '_ws') }
                  options={ [
                    { value: 'top', label: 'Top' },
                    { value: 'right', label: 'Right' }
                  ] }
                  onChange={ newValue => setAttributes({ imagePosition: newValue }) }
                  value={ imagePosition }
                />
              ) }
            </PanelBody>
          </InspectorControls>
          <div className={`card ${className || ''} ${imagePosition ? `image-${imagePosition}` : ''}`}>
            <MediaPreview
              id={ image }
              className="featured-image"
              x={ imageX }
              y={ imageY }
              size="medium"
              onChange={ newValue => setAttributes({ image: newValue }) }
            />
            <InnerBlocks />
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
  styles: [
    {
      name: 'default',
      label: __('Default', '_ws'),
      isDefault: true
    },
    {
      name: 'dark',
      label: __('Dark', '_ws')
    }
  ]
}
