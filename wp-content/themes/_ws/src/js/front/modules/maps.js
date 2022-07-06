/* globals google */
import * as utilities from 'Utilities'

function init() {
  const options = {
    styles: [
      {
        'featureType': 'administrative.land_parcel',
        'stylers': [
          {
            'visibility': 'off'
          }
        ]
      },
      {
        'featureType': 'administrative.neighborhood',
        'stylers': [
          {
            'visibility': 'off'
          }
        ]
      },
      {
        'featureType': 'poi',
        'elementType': 'labels.text',
        'stylers': [
          {
            'visibility': 'off'
          }
        ]
      },
      {
        'featureType': 'poi.business',
        'stylers': [
          {
            'visibility': 'off'
          }
        ]
      },
      {
        'featureType': 'poi.park',
        'elementType': 'labels.text',
        'stylers': [
          {
            'visibility': 'off'
          }
        ]
      },
      {
        'featureType': 'road',
        'elementType': 'geometry',
        'stylers': [
          {
            'color': '#ff8600'
          },
          {
            'lightness': 20
          },
          {
            'weight': 0.5
          }
        ]
      },
      {
        'featureType': 'road',
        'elementType': 'labels',
        'stylers': [
          {
            'visibility': 'off'
          }
        ]
      },
      {
        'featureType': 'road.arterial',
        'elementType': 'labels',
        'stylers': [
          {
            'visibility': 'off'
          }
        ]
      },
      {
        'featureType': 'road.highway',
        'elementType': 'labels',
        'stylers': [
          {
            'visibility': 'off'
          }
        ]
      },
      {
        'featureType': 'road.local',
        'stylers': [
          {
            'visibility': 'off'
          }
        ]
      },
      {
        'featureType': 'water',
        'stylers': [
          {
            'color': '#3eb1c8'
          }
        ]
      },
      {
        'featureType': 'water',
        'elementType': 'labels.text',
        'stylers': [
          {
            'visibility': 'off'
          }
        ]
      }
    ],
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false,
    controlSize: 30
  }
  initLocationMaps(options)
  initLocationLists()
}

function initLocationMaps(options) {
  document.querySelectorAll('.locations-map').forEach(el => {
    const locations = JSON.parse(decodeURIComponent(el.getAttribute('data-locations')))
    const map = new google.maps.Map(el, options)
    const bounds = new google.maps.LatLngBounds()
    const locationMarkers = []
    locations.forEach(location => {
      if (location.coordinates) {
        const phones = location.phones[0] ? `<p>${location.phones.join('<br />')}</p>` : ''
        const position = {
          lat: Number(location.coordinates.split(',')[0]),
          lng: Number(location.coordinates.split(',')[1])
        }
        locationMarkers.push({
          ...location,
          ...createMarker(
            map,
            position,
            `<p>${location.name ? `<b>${location.name}</b><br />` : ''}${location.address.replace(/\n/g, '<br />')}<br />${location.city}, ${location.state} ${location.zip}</p>${phones}<a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location.address + ', ' + location.city + ', ' + location.state + ', ' + location.zip)}" target="_blank" rel="noopener">Get Directions</a>`
          )
        })
        bounds.extend(position)
      }
    })
    const form = el.nextElementSibling.querySelector('form')
    initAutocomplete(locationMarkers, form)
    map.fitBounds(bounds)
  })
}

function initAutocomplete(locations, form) {
  const input = form.querySelector('input')
  const resultsDiv = form.querySelector('.results')
  input.addEventListener('input', function(e) {
    const filteredLocations = filterLocations(this.value, locations)
    const buttons = createButtons(this.value, filteredLocations)
    resultsDiv.innerHTML = ''
    if (buttons.length) {
      buttons.forEach(button => {
        resultsDiv.appendChild(button)
      })
    }
    else if (this.value.length > 1) {
      resultsDiv.innerHTML = '<i class="no-results">No results found.</i>'
    }
  })
  input.addEventListener('keydown', function(e) {
    const results = form.querySelectorAll('.result')
    if (e.keyCode === utilities.keyCodes.ARROW_UP) {
      e.preventDefault()
      if (results.length) {
        results[results.length - 1].focus()
      }
    }
    if (e.keyCode === utilities.keyCodes.ARROW_DOWN) {
      e.preventDefault()
      if (results.length) {
        results[0].focus()
      }
    }
  })
  form.addEventListener('submit', function(e) {
    e.preventDefault()
  })
}

function filterLocations(value, locations) {
  value = value.toLowerCase().trim()
  if (value.length > 1) {
    return locations.filter(location => {
      const line1 = location.name.toLowerCase()
      const line2 = location.address.toLowerCase()
      const line3 = location.city.toLowerCase() + ', ' + location.state.toLowerCase() + ' ' + location.zip.toLowerCase()
      return line1.indexOf(value) !== -1 || line2.indexOf(value) !== -1 || line3.indexOf(value) !== -1
    })
  }
  return []
}

function createButtons(value, locations) {
  const buttons = []
  locations.forEach(location => {
    let lines = [
      location.name,
      location.address,
      location.city + ', ' + location.state + ' ' + location.zip
    ]
    lines = lines.map(line => {
      const position = line.toLowerCase().indexOf(value.toLowerCase())
      if (position !== -1) {
        return [
          line.slice(0, position),
          '<b>',
          line.slice(position, position + value.length),
          '</b>',
          line.slice(position + value.length)
        ].join('')
      }
      return line
    })
    const button = document.createElement('button')
    button.classList.add('result')
    button.innerHTML = lines.join('<br />')
    button.addEventListener('click', function(e) {
      const marker = location.marker
      const map = marker.map
      map.panTo(location.marker.position)
      map.setZoom(12)
      locations.forEach(location => {
        location.infoWindow.close()
      })
      location.infoWindow.open(map, marker)
    })
    button.addEventListener('keydown', function(e) {
      if (e.keyCode === utilities.keyCodes.ARROW_UP) {
        e.preventDefault()
        if (this.previousElementSibling) {
          this.previousElementSibling.focus()
        }
        else {
          this.parentElement.lastElementChild.focus()
        }
      }
      if (e.keyCode === utilities.keyCodes.ARROW_DOWN) {
        e.preventDefault()
        if (this.nextElementSibling) {
          this.nextElementSibling.focus()
        }
        else {
          this.parentElement.firstElementChild.focus()
        }
      }
    })
    buttons.push(button)
  })
  return buttons
}

function initLocationLists() {
  document.querySelectorAll('.wp-block-ws-locations-list').forEach(el => {
    const input = el.querySelector('input')
    const locations = el.querySelectorAll('.location-list-item')
    input.addEventListener('input', function(e) {
      const value = this.value.toLowerCase().trim()
      locations.forEach(location => {
        const locationString = `${location.querySelector('h3').textContent.toLowerCase()} ${location.querySelector('.address').textContent.toLowerCase()}`
        if (locationString.indexOf(value) !== -1) {
          location.classList.remove('hide')
        }
        else {
          location.classList.add('hide')
        }
      })
    })
  })
}

function createMarker(map, position, html) {
  const marker = new google.maps.Marker({
    map: map,
    icon: '/wp-content/themes/_ws/assets/marker.png',
    position: position
  })
  const infoWindow = new google.maps.InfoWindow({
    content: `<div class="google-map-info-window">${html}</div>`
  })
  marker.addListener('click', () => {
    infoWindow.open(map, marker)
  })

  return {
    marker: marker,
    infoWindow: infoWindow
  }
}

export { init }
