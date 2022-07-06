/* global React, wp */
import MediaPreview from 'Components/media-preview.js'
import MediaSelect from 'Components/media-select.js'
const { InspectorControls, RichText } = wp.blockEditor
const { PanelBody, TextControl, ToggleControl } = wp.components
const { __ } = wp.i18n

export const bigCard = {
  name: 'ws/big-card',
  args: {
    title: __('Big Card', '_ws'),
    description: __('Card styled link with a large image.', '_ws'),
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
      heading: {
        type: 'string'
      },
      text: {
        type: 'string'
      },
      link: {
        type: 'object',
        default: {
          url: '',
          opensInNewTab: false
        }
      }
    },
    edit: props => {
      const { setAttributes } = props
      const { className, image, imageX, imageY, heading, text, link } = props.attributes
      return (
        <>
          <InspectorControls>
            <PanelBody
              title={ __('Card Options', '_ws') }
            >
              <MediaSelect
                label={ __('Image', '_ws') }
                onChange={ ({ id, focalPoint }) => setAttributes({ image: id, imageX: focalPoint.x, imageY: focalPoint.y }) }
                id={ image }
                focalPoint={ {
                  x: imageX,
                  y: imageY
                } }
              />
              <TextControl
                label={ __('Link URL', '_ws') }
                onChange={ newValue => setAttributes({ link: { ...link, url: newValue } }) }
                value={ link.url }
              />
              <ToggleControl
                label={ __('Open in new tab', '_ws') }
                onChange={ newValue => setAttributes({ link: { ...link, opensInNewTab: newValue } }) }
                checked={ link.opensInNewTab }
              />
            </PanelBody>
          </InspectorControls>
          <div className={ `card ${className || ''}` }>
            <MediaPreview
              id={ image }
              className="featured-image"
              x={ imageX }
              y={ imageY }
              size="medium"
              onChange={ newValue => setAttributes({ image: newValue }) }
            />
            <RichText
              placeholder={ __('Heading', '_ws') }
              tagName="h3"
              keepPlaceholderOnFocus={ true }
              onChange={ newValue => setAttributes({ heading: newValue }) }
              value={ heading }
            />
            <RichText
              placeholder={ __('Text', '_ws') }
              tagName="p"
              keepPlaceholderOnFocus={ true }
              onChange={ newValue => setAttributes({ text: newValue }) }
              value={ text }
            />
          </div>
        </>
      )
    },
    save: props => {
      return null
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
