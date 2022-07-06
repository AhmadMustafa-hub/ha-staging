/* globals React, wp */
const { InspectorControls } = wp.blockEditor
const { CheckboxControl, PanelBody } = wp.components
const { createHigherOrderComponent } = wp.compose
const { __ } = wp.i18n

export const imageControls = {
  hook: 'editor.BlockEdit',
  name: 'ws/with-image-controls',
  func: createHigherOrderComponent(BlockEdit => {
    return props => {
      if (props.name !== 'core/image') {
        return (
          <BlockEdit { ...props } />
        )
      }
      const { setAttributes } = props
      const { className } = props.attributes
      const classes = className ? className.split(' ') : []
      return (
        <>
          <InspectorControls>
            <PanelBody
              title={ __('Extend', '_ws') }
            >
              <CheckboxControl
                label={ __('Extend Left', '_ws') }
                onChange={ newValue => {
                  const classIndex = classes.indexOf('extend-left')
                  if (newValue && classIndex === -1) {
                    classes.push('extend-left')
                    setAttributes({ className: classes.join(' ') })
                  }
                  else if (!newValue && classIndex !== -1) {
                    classes.splice(classIndex, 1)
                    setAttributes({ className: classes.join(' ') })
                  }
                } }
                checked={ classes.indexOf('extend-left') !== -1 }
              />
              <CheckboxControl
                label={ __('Extend Right', '_ws') }
                onChange={ newValue => {
                  const classIndex = classes.indexOf('extend-right')
                  if (newValue && classIndex === -1) {
                    classes.push('extend-right')
                    setAttributes({ className: classes.join(' ') })
                  }
                  else if (!newValue && classIndex !== -1) {
                    classes.splice(classIndex, 1)
                    setAttributes({ className: classes.join(' ') })
                  }
                } }
                checked={ classes.indexOf('extend-right') !== -1 }
              />
            </PanelBody>
          </InspectorControls>
          <BlockEdit { ...props } />
        </>
      )
    }
  }, 'withImageControls')
}
