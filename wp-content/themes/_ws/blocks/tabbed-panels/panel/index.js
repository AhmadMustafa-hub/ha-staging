/* global React, wp */
const { InnerBlocks } = wp.blockEditor
const { useEffect } = wp.element
const { __ } = wp.i18n

export const panel = {
  name: 'ws/panel',
  args: {
    title: __('Panel', '_ws'),
    icon: 'format-aside',
    category: 'ws-layout',
    supports: {
      customClassName: false,
      html: false
    },
    parent: ['ws/tabbed-panels'],
    attributes: {
      heading: {
        type: 'string'
      },
      uid: {
        type: 'string'
      },
      isActive: {
        type: 'boolean'
      }
    },
    edit: props => {
      const { setAttributes } = props
      const { isActive } = props.attributes
      useEffect(() => {
        setAttributes({ uid: props.clientId })
      }, [])
      return (
        <div className={ `panel ${isActive ? 'is-active' : ''}` }>
          <InnerBlocks />
        </div>
      )
    },
    save: props => {
      return (
        <InnerBlocks.Content />
      )
    }
  }
}
