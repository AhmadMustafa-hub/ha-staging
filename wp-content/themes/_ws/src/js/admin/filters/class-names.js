/* globals React, wp */
const { createHigherOrderComponent } = wp.compose

export const classNames = {
  hook: 'editor.BlockListBlock',
  name: 'ws/with-class-name',
  func: createHigherOrderComponent(BlockListBlock => {
    return props => {
      if (props.name.startsWith('ws/')) {
        return <BlockListBlock { ...props } className={ `ws-block-${props.name.substr(3)} ${props.attributes.className || ''}` } />
      }
      return <BlockListBlock { ...props } />
    }
  })
}
