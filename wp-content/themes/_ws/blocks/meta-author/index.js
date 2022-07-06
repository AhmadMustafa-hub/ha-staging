/* global React, wp */
const { InnerBlocks } = wp.blockEditor
const { serialize } = wp.blocks
const { useDispatch, useSelect } = wp.data
const { useEffect } = wp.element
const { __ } = wp.i18n

export const metaAuthor = {
  name: 'ws/meta-author',
  args: {
    title: __('Author Meta', '_ws'),
    description: __('Author and profile image override. Only the data is used, so this block\'s position does not matter.', '_ws'),
    icon: 'edit',
    category: 'ws-meta',
    supports: {
      multiple: false,
      customClassName: false
    },
    attributes: {
      authors: {
        type: 'string',
        source: 'meta',
        meta: '_authors'
      }
    },
    edit: props => {
      const { setAttributes } = props
      const { blocks } = useSelect(select => ({
        blocks: select('core/block-editor').getBlocks(props.clientId)
      }))
      useEffect(() => {
        setAttributes({ authors: serialize(blocks) })
      }, [blocks])
      const { editPost } = useDispatch('core/editor')
      useEffect(() => {
        return () => {
          const metas = {}
          for (const attribute in metaAuthor.args.attributes) {
            const metaName = metaAuthor.args.attributes[attribute].meta
            const metaType = metaAuthor.args.attributes[attribute].type
            metas[metaName] = metaType === 'boolean' ? false : (metaType === 'number' ? 0 : '')
          }
          editPost({ meta: metas })
        }
      }, [])
      return (
        <fieldset>
          <legend>Authors</legend>
          <InnerBlocks
            allowedBlocks={ ['ws/person'] }
          />
        </fieldset>
      )
    },
    save: props => {
      return <InnerBlocks.Content />
    }
  }
}
