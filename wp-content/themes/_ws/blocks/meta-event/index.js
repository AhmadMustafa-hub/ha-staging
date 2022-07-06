/* global React, wp */
import DateTimePicker from 'Components/date-time-picker.js'
import LocationPicker from 'Components/location-picker.js'
const { TextareaControl, ToggleControl } = wp.components
const { useDispatch } = wp.data
const { useEffect } = wp.element
const { __ } = wp.i18n

export const metaEvent = {
  name: 'ws/meta-event',
  args: {
    title: __('Event Meta', '_ws'),
    description: __('Data about the event. Only the data is used, so this block\'s position does not matter.', '_ws'),
    icon: 'calendar',
    category: 'ws-meta',
    supports: {
      multiple: false,
      customClassName: false
    },
    attributes: {
      dateTBD: {
        type: 'boolean',
        source: 'meta',
        meta: '_event_date_tbd'
      },
      startDate: {
        type: 'string',
        source: 'meta',
        meta: '_event_start_date'
      },
      hasStartTime: {
        type: 'boolean',
        source: 'meta',
        meta: '_event_has_start_time'
      },
      endDate: {
        type: 'string',
        source: 'meta',
        meta: '_event_end_date'
      },
      hasEndTime: {
        type: 'boolean',
        source: 'meta',
        meta: '_event_has_end_time'
      },
      hasLocation: {
        type: 'boolean',
        source: 'meta',
        meta: '_event_has_location'
      },
      locationName: {
        type: 'string',
        source: 'meta',
        meta: '_event_location_name'
      },
      locationStreet: {
        type: 'string',
        source: 'meta',
        meta: '_event_location_street'
      },
      locationCity: {
        type: 'string',
        source: 'meta',
        meta: '_event_location_city'
      },
      locationState: {
        type: 'string',
        source: 'meta',
        meta: '_event_location_state'
      },
      locationZip: {
        type: 'string',
        source: 'meta',
        meta: '_event_location_zip'
      },
      locationOverride: {
        type: 'string',
        source: 'meta',
        meta: '_event_location_override'
      }
    },
    edit: props => {
      const { setAttributes } = props
      const { dateTBD, startDate, hasStartTime, endDate, hasEndTime, hasLocation, locationName, locationStreet, locationCity, locationState, locationZip, locationOverride } = props.attributes
      const { editPost } = useDispatch('core/editor')
      useEffect(() => {
        return () => {
          const metas = {}
          for (const attribute in metaEvent.args.attributes) {
            const metaName = metaEvent.args.attributes[attribute].meta
            const metaType = metaEvent.args.attributes[attribute].type
            metas[metaName] = metaType === 'boolean' ? false : (metaType === 'number' ? 0 : '')
          }
          editPost({ meta: metas })
        }
      }, [])
      return (
        <>
          <div className={ 'row event-date ' + (dateTBD ? 'no-date' : '') }>
            <div className="col">
              <DateTimePicker
                label={ __('Start Date', '_ws') }
                onChange={ (date, hasTime) => setAttributes({ startDate: date, hasStartTime: hasTime }) }
                hasTime={ hasStartTime }
                date={ startDate }
              />
            </div>
            <div className="col">
              <DateTimePicker
                label={ __('End Date', '_ws') }
                onChange={ (date, hasTime) => setAttributes({ endDate: date, hasEndTime: hasTime }) }
                hasTime={ hasEndTime }
                date={ endDate }
              />
            </div>
            <div className="col">
              <ToggleControl
                label={ __('Date TBD', '_ws') }
                checked={ dateTBD }
                onChange={ newValue => setAttributes({ dateTBD: newValue }) }
              />
            </div>
          </div>
          <ToggleControl
            label={ __('Location', '_ws') }
            checked={ hasLocation }
            onChange={ newValue => setAttributes({ hasLocation: newValue }) }
          />
          { hasLocation ? (
            <LocationPicker
              onChange={ newValue => setAttributes({ locationName: newValue.name, locationStreet: newValue.street, locationCity: newValue.city, locationState: newValue.state, locationZip: newValue.zip }) }
              location={ { name: locationName, street: locationStreet, city: locationCity, state: locationState, zip: locationZip } }
            />
          ) : (
            <TextareaControl
              placeholder={ __('Online, TBD, Multiple Locations, etc...') }
              label={ __('Location Alternative', '_ws') }
              onChange={ newValue => setAttributes({ locationOverride: newValue }) }
              value={ locationOverride }
            />
          ) }
        </>
      )
    },
    save: props => {
      return null
    }
  }
}
