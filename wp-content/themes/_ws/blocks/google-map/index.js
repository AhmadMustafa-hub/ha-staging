/* global React, wp */
const { TextareaControl } = wp.components
const { __ } = wp.i18n

export const googleMap = {
  name: 'ws/google-map',
  args: {
    title: __('Google Map', '_ws'),
    description: __('Iframe of Google Maps with editable location.', '_ws'),
    icon: 'location-alt',
    category: 'ws-bit',
    supports: {
      anchor: true
    },
    attributes: {
      address: {
        type: 'string'
      }
    },
    edit: props => {
      const { setAttributes } = props
      const { address } = props.attributes
      return (
        <TextareaControl
          label={ __('Address', '_ws') }
          onChange={ newValue => setAttributes({ address: newValue }) }
          value={ address }
        />
      )
    },
    save: props => {
      return null
    }
  }
}
