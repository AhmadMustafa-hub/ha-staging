/* global React, wp */
const { InnerBlocks, PlainText } = wp.blockEditor
const { BaseControl } = wp.components
const { __ } = wp.i18n

export const form = {
  name: 'ws/form',
  args: {
    title: __('Form', '_ws'),
    description: __('Form with completion message.', '_ws'),
    icon: 'forms',
    category: 'ws-bit',
    supports: {
      anchor: true
    },
    attributes: {
      form: {
        type: 'string'
      }
    },
    edit: props => {
      const { setAttributes } = props
      const { form } = props.attributes
      return (
        <>
          <BaseControl
            label={ __('Embed Code', '_ws') }
          >
            <PlainText
              placeholder={ __('Paste script/iframe here...', '_ws') }
              onChange={ newValue => setAttributes({ form: newValue }) }
              value={ form }
            />
          </BaseControl>
          <fieldset>
            <legend>{ __('Completion Message', '_ws') }</legend>
            <InnerBlocks />
          </fieldset>
        </>
      )
    },
    save: props => {
      return (
        <InnerBlocks.Content />
      )
    }
  },
  styles: [
    {
      name: 'one-column',
      label: __('One Column', '_ws'),
      isDefault: true
    },
    {
      name: 'multiple-columns',
      label: __('Multiple Columns (Wide)', '_ws')
    }
  ]
}
