/* global React, wp */
import { tile } from './tile/index.js'
const { InnerBlocks } = wp.blockEditor
const { __ } = wp.i18n

export const tiles = {
  name: 'ws/tiles',
  args: {
    title: __('Tiles', '_ws'),
    description: __('Flexible grid of tiles.', '_ws'),
    icon: 'screenoptions',
    category: 'ws-layout',
    supports: {
      anchor: true
    },
    edit: props => {
      return (
        <div className="tile-grid">
          <InnerBlocks
            allowedBlocks={ ['ws/tile'] }
            template={ [
              ['ws/tile']
            ] }
          />
        </div>
      )
    },
    save: props => {
      return (
        <InnerBlocks.Content />
      )
    }
  },
  innerBlocks: [tile],
  styles: [
    {
      name: 'no-gutters',
      label: __('No Gutters', '_ws'),
      isDefault: true
    },
    {
      name: 'gutters',
      label: __('Gutters', '_ws')
    }
  ]
}
