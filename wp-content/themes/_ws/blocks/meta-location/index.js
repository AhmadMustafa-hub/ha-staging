/* global React, wp */
import LocationPicker from 'Components/location-picker.js'
const { TextControl } = wp.components
const { useDispatch } = wp.data
const { useEffect } = wp.element
const { __ } = wp.i18n

export const metaLocation = {
  name: 'ws/meta-location',
  args: {
    title: __('Location Meta', '_ws'),
    description: __('Location template data. Only the data is used, so this block\'s position does not matter.', '_ws'),
    icon: 'groups',
    category: 'ws-meta',
    supports: {
      multiple: false,
      customClassName: false
    },
    attributes: {
      name: {
        type: 'string',
        source: 'meta',
        meta: '_location_name'
      },
      address: {
        type: 'string',
        source: 'meta',
        meta: '_location_address'
      },
      city: {
        type: 'string',
        source: 'meta',
        meta: '_location_city'
      },
      displayCity: {
        type: 'string',
        source: 'meta',
        meta: '_location_display_city'
      },
      state: {
        type: 'string',
        source: 'meta',
        meta: '_location_state'
      },
      zip: {
        type: 'string',
        source: 'meta',
        meta: '_location_zip'
      },
      coordinates: {
        type: 'string',
        source: 'meta',
        meta: '_location_coordinates'
      },
      phones: {
        type: 'string',
        source: 'meta',
        meta: '_location_phones'
      }
    },
    edit: props => {
      const { setAttributes } = props
      const { name, address, city, displayCity, state, zip, coordinates, phones } = props.attributes
      const { editPost } = useDispatch('core/editor')
      useEffect(() => {
        return () => {
          const metas = {}
          for (const attribute in metaLocation.args.attributes) {
            const metaName = metaLocation.args.attributes[attribute].meta
            const metaType = metaLocation.args.attributes[attribute].type
            metas[metaName] = metaType === 'boolean' ? false : (metaType === 'number' ? 0 : '')
          }
          editPost({ meta: metas })
        }
      }, [])
      return (
        <div className="row">
          <div className="col-xs-12">
            <LocationPicker
              onChange={ newValue => setAttributes({
                name: newValue.name,
                address: newValue.street,
                city: newValue.city,
                state: newValue.state,
                zip: newValue.zip,
                coordinates: newValue.coordinates
              }) }
              location={ {
                name: name,
                street: address,
                city: city,
                state: state,
                zip: zip,
                coordinates: coordinates
              } }
            />
          </div>
          <div className="col-sm-6">
            <TextControl
              label={ <>{ __('Phone Numbers', '_ws') } <small>{ __('comma separated', '_ws') }</small></> }
              onChange={ newValue => setAttributes({ phones: newValue }) }
              value={ phones }
            />
          </div>
          <div className="col-sm-6">
            <TextControl
              label={ <>{ __('Display City', '_ws') } <small>{ __('optional', '_ws') }</small></> }
              onChange={ newValue => setAttributes({ displayCity: newValue }) }
              value={ displayCity }
            />
          </div>
        </div>
      )
    },
    save: props => {
      return null
    }
  }
}
