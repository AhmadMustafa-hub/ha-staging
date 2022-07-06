/* global React, wp, locals */
import SVGPicker from 'Components/svg-picker.js'
const { TextControl } = wp.components
const { __ } = wp.i18n

export const socialLink = {
  name: 'ws/social-link',
  args: {
    title: __('Social Link', '_ws'),
    icon: 'format-aside',
    category: 'ws-bit',
    supports: {
      customClassName: false,
      html: false
    },
    parent: ['ws/social-link'],
    attributes: {
      icon: {
        type: 'string',
        source: 'attribute',
        selector: 'svg',
        attribute: 'data-id'
      },
      url: {
        type: 'string',
        source: 'attribute',
        attribute: 'href'
      }
    },
    edit: props => {
      const { setAttributes } = props
      const { icon, url } = props.attributes
      return (
        <div className="row">
          <SVGPicker
            label={ false }
            className="col"
            onChange={ newValue => setAttributes({ icon: newValue }) }
            value={ icon }
          />
          <TextControl
            label={ false }
            className="col url-input"
            placeholder={ __('URL', '_ws') }
            onChange={ newValue => setAttributes({ url: newValue }) }
            value={ url }
          />
        </div>
      )
    },
    save: props => {
      const { icon, url } = props.attributes
      let svg
      locals.svgs.forEach(s => {
        if (s.id === icon) {
          svg = s
        }
      })
      if (svg) {
        return (
          <a
            href={ url }
            className="social-link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={ `Visit ${svg.title}` }
          >
            <svg
              data-id={ svg.id }
              viewBox={ svg.viewbox }
              fillRule="evenodd"
              dangerouslySetInnerHTML={ { __html: svg.path } }
            >
            </svg>
          </a>
        )
      }
    }
  }
}
