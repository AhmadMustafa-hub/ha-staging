/* global React, wp, locals */
import MediaSelect from 'Components/media-select.js'
const { __ } = wp.i18n

export const socialShare = {
  name: 'ws/social-share',
  args: {
    title: __('Social Share', '_ws'),
    description: __('Quick links to share on social media.', '_ws'),
    icon: 'share',
    category: 'ws-bit',
    supports: {
      customClassName: false
    },
    attributes: {
      pdf: {
        type: 'number'
      }
    },
    edit: props => {
      const { setAttributes } = props
      const { pdf } = props.attributes
      let twitter
      let facebook
      let linkedin
      let mail
      locals.svgs.forEach(svg => {
        if (svg.id === 'send') {
          mail = svg
        }
        if (svg.id === 'twitter') {
          twitter = svg
        }
        if (svg.id === 'facebook') {
          facebook = svg
        }
        if (svg.id === 'linkedin') {
          linkedin = svg
        }
      })
      return (
        <div className="social-share">
          <MediaSelect
            label={ false }
            buttonText={ __('Select PDF', '_ws') }
            onChange={ ({ id }) => setAttributes({ pdf: id }) }
            id={ pdf }
          />
          { mail && (
            <svg
              viewBox={ mail.viewbox }
              fillRule="evenodd"
              dangerouslySetInnerHTML={ { __html: mail.path } }
            >
            </svg>
          ) }
          { linkedin && (
            <svg
              viewBox={ linkedin.viewbox }
              fillRule="evenodd"
              dangerouslySetInnerHTML={ { __html: linkedin.path } }
            >
            </svg>
          ) }
          { facebook && (
            <svg
              viewBox={ facebook.viewbox }
              fillRule="evenodd"
              dangerouslySetInnerHTML={ { __html: facebook.path } }
            >
            </svg>
          ) }
          { twitter && (
            <svg
              viewBox={ twitter.viewbox }
              fillRule="evenodd"
              dangerouslySetInnerHTML={ { __html: twitter.path } }
            >
            </svg>
          ) }
        </div>
      )
    },
    save: props => {
      return null
    }
  }
}
