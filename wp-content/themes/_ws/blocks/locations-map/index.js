/* global React, wp */
const { Dashicon } = wp.components
const { __ } = wp.i18n

export const locationsMap = {
  name: 'ws/locations-map',
  args: {
    title: __('Locations Map', '_ws'),
    description: __('Iframe of Google Maps with all locations and search functionality.', '_ws'),
    icon: 'location-alt',
    category: 'ws-dynamic',
    supports: {
      anchor: true
    },
    edit: props => {
      return (
        <div className="map-placeholder">
          <Dashicon icon="location-alt" />
          <small>{ __('Google Map', '_ws') }</small>
        </div>
      )
    },
    save: props => {
      return null
    }
  }
}
