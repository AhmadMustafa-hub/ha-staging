/* globals React, wp */
const { AlignmentToolbar, BlockControls } = wp.blockEditor
const { createHigherOrderComponent } = wp.compose

export const textAlignControls = {
  hook: 'editor.BlockEdit',
  name: 'ws/with-text-align-controls',
  func: createHigherOrderComponent(BlockEdit => {
    return props => {
      if (!wp.blocks.hasBlockSupport(props.name, 'textAlign')) {
        return (
          <BlockEdit { ...props } />
        )
      }
      const { setAttributes } = props
      const { className } = props.attributes
      const classes = className ? className.split(' ') : []
      let alignment = 'none'
      classes.forEach(c => {
        if (c.startsWith('has-text-align-')) {
          alignment = c.substring(15)
        }
      })
      return (
        <>
          <BlockControls>
            <AlignmentToolbar
              onChange={ newValue => {
                const alignIndex = classes.findIndex(c => c.startsWith('has-text-align-'))
                if (newValue) {
                  if (alignIndex !== -1) {
                    classes[alignIndex] = `has-text-align-${newValue}`
                  }
                  else {
                    classes.push(`has-text-align-${newValue}`)
                  }
                }
                else if (alignIndex !== -1) {
                  classes.splice(alignIndex, 1)
                }
                setAttributes({ className: classes.join(' ') })
              } }
              value={ alignment && ['none', 'left', 'center', 'right'].includes(alignment) ? alignment : 'none' }
            />
          </BlockControls>
          <BlockEdit { ...props } />
        </>
      )
    }
  }, 'withTextAlignControls')
}

// export const textAlignAttributes = {
//   hook: 'blocks.registerBlockType',
//   name: 'ws/with-text-align-attributes',
//   func: (props, name) => {
//     if (!name.startsWith('ws/') || name.startsWith('ws/meta-') || name.startsWith('ws/calculator-')) {
//       return props
//     }
//     props.attributes = {
//       ...props.attributes,
//       textAlign: {
//         type: 'string'
//       }
//     }
//   }
// }
