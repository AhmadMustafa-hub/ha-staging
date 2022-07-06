/* global React, wp */
import MediaSelect from 'Components/media-select.js'
const { InspectorControls, RichText } = wp.blockEditor
const { PanelBody, TextControl, ToggleControl } = wp.components
const { __ } = wp.i18n

export const testimonial = {
  name: 'ws/testimonial',
  args: {
    title: __('Testimonial', '_ws'),
    description: __('Quote with optional citation and image fields.', '_ws'),
    icon: 'format-quote',
    category: 'ws-layout',
    supports: {
      anchor: true
    },
    attributes: {
      image: {
        type: 'number'
      },
      quote: {
        type: 'string'
      },
      citation: {
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
      const { className, image, quote, citation, link } = props.attributes
      return (
        <>
          <InspectorControls>
            <PanelBody
              title={ __('Testimonial Options', '_ws') }
            >
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
          <div className={ `testimonial ${className || ''}` }>
            <div className="image">
              <MediaSelect
                label={ false }
                size="small"
                buttonText={ __('Headshot', '_ws') }
                onChange={ ({ id }) => setAttributes({ image: id }) }
                id={ image }
              />
            </div>
            <div className="quote-citation">
              <RichText
                placeholder={ __('Quote', '_ws') }
                tagName="p"
                className="quote"
                onChange={ newValue => setAttributes({ quote: newValue }) }
                value={ quote }
              />
              <RichText
                placeholder={ __('Citation', '_ws') }
                tagName="p"
                className="citation"
                onChange={ newValue => setAttributes({ citation: newValue }) }
                value={ citation }
              />
            </div>
          </div>
        </>
      )
    },
    save: props => {
      return null
    },
    styles: [
      {
        name: 'default',
        label: __('Default', '_ws'),
        isDefault: true
      },
      {
        name: 'reverse',
        label: __('Reverse', '_ws')
      }
    ]
  }
}
