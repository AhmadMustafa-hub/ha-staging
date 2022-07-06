/* global React, wp */
import { iconListItem } from './icon-list-item/index.js'
const { InnerBlocks } = wp.blockEditor
const { useSelect, useDispatch } = wp.data
const { useEffect, useRef } = wp.element
const { __ } = wp.i18n

export const iconList = {
  name: 'ws/icon-list',
  args: {
    title: __('Icon List', '_ws'),
    description: __('List with svg bullet points.', '_ws'),
    icon: 'editor-ul',
    category: 'ws-bit',
    edit: props => {
      const { removeBlock } = useDispatch('core/block-editor')
      const { blockCount } = useSelect(select => ({
        blockCount: select('core/block-editor').getBlockOrder(props.clientId).length
      }))
      const previousBlockCount = useRef(blockCount)
      useEffect(() => {
        if (previousBlockCount.current > 0 && blockCount === 0) {
          removeBlock(props.clientId)
        }
        previousBlockCount.current = blockCount
      }, [blockCount, props.clientId])
      return (
        <InnerBlocks
          allowedBlocks={ ['ws/icon-list-item'] }
          template={ [['ws/icon-list-item']] }
          templateLock={ false }
          renderAppender={ false }
        />
      )
    },
    save: props => {
      return (
        <InnerBlocks.Content />
      )
    }
  },
  innerBlocks: [iconListItem]
}
