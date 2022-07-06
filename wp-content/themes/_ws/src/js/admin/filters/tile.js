/* globals React, wp */
const { createHigherOrderComponent } = wp.compose

export const tileClasses = {
  hook: 'editor.BlockListBlock',
  name: 'ws/with-tile-class',
  func: createHigherOrderComponent(BlockListBlock => {
    return props => {
      if (props.name === 'ws/tile') {
        return (
          <BlockListBlock { ...props } className={ props.attributes.size || '' } />
        )
      }
      return <BlockListBlock { ...props } />
    }
  }, 'withTileClass')
}
