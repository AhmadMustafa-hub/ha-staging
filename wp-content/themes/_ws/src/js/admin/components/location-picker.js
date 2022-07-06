/* globals React, wp, locals, google */
const { Dashicon, TextControl } = wp.components
const { useEffect, useRef, useState } = wp.element
const { __ } = wp.i18n

export default function LocationPicker(props) {
  const { className, location, onChange } = props
  const [map, setMap] = useState(null)
  const [geocoder, setGeocoder] = useState(null)
  const [marker, setMarker] = useState([])
  const [timer, setTimer] = useState(null)
  const [state, setState] = useState('loading')
  const googleMap = useRef(null)

  useEffect(() => {
    const googleMapScript = document.createElement('script')
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${locals.googleMaps}`
    window.document.body.appendChild(googleMapScript)
    googleMapScript.addEventListener('load', () => {
      const mapInstance = new google.maps.Map(googleMap.current, { zoom: 3, center: { lat: 37, lng: 95 } })
      const geocoderInstance = new google.maps.Geocoder()
      const markerInstance = new google.maps.Marker()
      setMap(mapInstance)
      setGeocoder(geocoderInstance)
      setMarker(markerInstance)
      updateMap(mapInstance, geocoderInstance, markerInstance)
    })
  }, [])

  useEffect(() => {
    if (map && geocoder && marker) {
      setState('loading')
      if (timer) {
        clearTimeout(timer)
      }
      setTimer(setTimeout(e => {
        updateMap(map, geocoder, marker)
      }, 2000))
    }
  }, [location.name, location.street, location.city, location.state, location.zip])

  // function onTyping(newValues) {
  //   onChange(newValues)
  //   setState('loading')
  //   if (timer) {
  //     clearTimeout(timer)
  //   }
  //   setTimer(setTimeout(e => {
  //     updateMap(map, geocoder, marker)
  //   }, 2000))
  // }

  function updateMap(map, geocoder, marker) {
    const locationString = `${location.name} ${location.street} ${location.city} ${location.state} ${location.zip}`
    geocoder.geocode({ 'address': locationString }, (results, status) => {
      if (status === 'OK') {
        const position = results[0].geometry.location
        onChange({ ...location, coordinates: `${position.lat()},${position.lng()}` })
        // const marker = new google.maps.Marker({
        //   position: position
        // })
        marker.setPosition(position)
        marker.setMap(map)
        map.setCenter(position)
        map.setZoom(12)
        setState('success')
      }
      else {
        setState('error')
        onChange({ ...props.location, coordinates: null })
      }
    })
  }

  return (
    <div className={ `components-location-picker ${className}` }>
      <TextControl
        placeholder={ __('Name (Optional)', '_ws') }
        onChange={ newValue => onChange({ ...location, name: newValue }) }
        value={ location.name }
      />
      <TextControl
        placeholder={ __('Street', '_ws') }
        onChange={ newValue => onChange({ ...location, street: newValue }) }
        value={ location.street }
      />
      <TextControl
        placeholder={ __('City', '_ws') }
        onChange={ newValue => onChange({ ...location, city: newValue }) }
        value={ location.city }
      />
      <TextControl
        placeholder={ __('State', '_ws') }
        onChange={ newValue => onChange({ ...location, state: newValue }) }
        value={ location.state }
      />
      <TextControl
        placeholder={ __('Zip Code', '_ws') }
        onChange={ newValue => onChange({ ...location, zip: newValue }) }
        value={ location.zip }
      />
      <div style={ { display: state === 'success' ? 'block' : 'none' } } className="google-map" ref={ googleMap }></div>
      <div style={ { display: state !== 'success' ? 'flex' : 'none' } } className="map-placeholder">
        <Dashicon icon="location-alt" />
        { state === 'error' ? (
          <small>{ __('Location Not Found', '_ws') }</small>
        ) : (
          <small>{ __('Loading...', '_ws') }</small>
        ) }
      </div>
    </div>
  )
}
