/* global React, wp */
const { RichText } = wp.blockEditor
const { __ } = wp.i18n

export const event = {
  name: 'ws/event',
  args: {
    title: __('Event', '_ws'),
    description: __('Simple date and event title.', '_ws'),
    icon: 'calendar-alt',
    category: 'ws-bit',
    supports: {
      anchor: true
    },
    attributes: {
      date: {
        type: 'string'
      },
      name: {
        type: 'string'
      }
    },
    edit: props => {
      const { setAttributes } = props
      const { date, name } = props.attributes
      return (
        <>
          <RichText
            className="subhead"
            placeholder={ __('Date', '_ws') }
            multiline={ false }
            keepPlaceholderOnFocus={ true }
            onChange={ newValue => setAttributes({ date: newValue }) }
            value={ date }
          />
          <RichText
            placeholder={ __('Event Name', '_ws') }
            multiline={ false }
            keepPlaceholderOnFocus={ true }
            tagName="h3"
            onChange={ newValue => setAttributes({ name: newValue }) }
            value={ name }
          />
        </>
      )
    },
    save: props => {
      return null
    }
  }
}
