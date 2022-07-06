/* globals React, wp */
import { socialLink } from './social-link/index.js'
const { InnerBlocks } = wp.blockEditor
const { createBlock } = wp.blocks
const { Button } = wp.components
const { useDispatch, useSelect } = wp.data
const { __ } = wp.i18n

export const socialLinks = {
  name: 'ws/social-links',
  args: {
    title: __('Social Links', '_ws'),
    description: __('SVG links to social sites.', '_ws'),
    icon: 'share-alt2',
    category: 'ws-bit',
    supports: {
      anchor: true
    },
    edit: props => {
      const { insertBlock } = useDispatch('core/block-editor')
      const { getBlockCount } = useSelect(select => select('core/block-editor'))
      return (
        <InnerBlocks
          allowedBlocks={ ['ws/social-link'] }
          templateLock={ false }
          renderAppender={ () => (
            <Button
              isSecondary
              onClick={ e => {
                insertBlock(createBlock('ws/social-link'), getBlockCount(props.clientId), props.clientId)
              } }
            >
              { __('Add Link', '_ws') }
            </Button>
          ) }
        />
      )
    },
    save: props => {
      return (
        <InnerBlocks.Content />
      )
    }
  },
  innerBlocks: [socialLink]
}
