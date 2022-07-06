/* global React, wp */
const { TextControl } = wp.components
const { useDispatch } = wp.data
const { useEffect } = wp.element
const { __ } = wp.i18n

export const metaLink = {
  name: 'ws/meta-link',
  args: {
    title: __('Page Link Meta', '_ws'),
    description: __('Modify page behavior. Only the data is used, so this block\'s position does not matter.', '_ws'),
    icon: 'external',
    category: 'ws-meta',
    supports: {
      multiple: false,
      customClassName: false
    },
    attributes: {
      linkExternal: {
        type: 'string',
        source: 'meta',
        meta: '_link_external'
      },
      linkLightbox: {
        type: 'string',
        source: 'meta',
        meta: '_link_lightbox'
      }
    },
    edit: props => {
      const { setAttributes } = props
      const { linkExternal, linkLightbox } = props.attributes
      const { editPost } = useDispatch('core/editor')
      useEffect(() => {
        return () => {
          const metas = {}
          for (const attribute in metaLink.args.attributes) {
            const metaName = metaLink.args.attributes[attribute].meta
            const metaType = metaLink.args.attributes[attribute].type
            metas[metaName] = metaType === 'boolean' ? false : (metaType === 'number' ? 0 : '')
          }
          editPost({ meta: metas })
        }
      }, [])
      return (
        <div className="row">
          <div className="col-sm-6">
            <TextControl
              label={ <>{ __('Open URL in new tab', '_ws') } <small>{ __('(external link)', '_ws') }</small></> }
              onChange={ newValue => setAttributes({ linkExternal: newValue }) }
              value={ linkExternal }
            />
          </div>
          <div className="col-sm-6">
            <TextControl
              label={ <>{ __('Open URL in lightbox', '_ws') } <small>{ __('(external iframe)', '_ws') }</small></> }
              onChange={ newValue => setAttributes({ linkLightbox: newValue }) }
              value={ linkLightbox }
            />
          </div>
        </div>
      )
    },
    save: props => {
      return null
    }
  }
}
