/* global React, wp */
const { useSelect } = wp.data
const { InnerBlocks } = wp.blockEditor
const { __ } = wp.i18n

export const sidebar = {
  name: 'ws/sidebar',
  args: {
    title: __('Sidebar', '_ws'),
    icon: 'info-outline',
    category: 'ws-layout',
    supports: {
      customClassName: false,
      html: false
    },
    parent: ['ws/content-sidebar'],
    edit: props => {
      const { hasChildBlocks } = useSelect(select => ({
        hasChildBlocks: select('core/block-editor').getBlockOrder(props.clientId).length > 0
      }))
      return (
        <InnerBlocks
          templateLock={ false }
          renderAppender={ hasChildBlocks ? undefined : () => <InnerBlocks.ButtonBlockAppender /> }
        />
      )
    },
    save: props => {
      return (
        <aside className="col">
          <div className="inner-sidebar">
            <InnerBlocks.Content />
          </div>
        </aside>
      )
    }
  }
}
