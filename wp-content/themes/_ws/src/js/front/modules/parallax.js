import * as utilities from 'Utilities'

function init() {
  parallaxEvent()
  window.addEventListener('load', () => {
    parallaxEvent()
  })
  window.removeEventListener('throttleScroll', parallaxEvent, false)
  window.addEventListener('throttleScroll', parallaxEvent, false)
}

function parallaxEvent() {
  document.querySelectorAll('.parallax-bg').forEach(element => {
    const wrapper = document.createElement('div')
    wrapper.classList.add('parallax-background')
    element.parentNode.insertBefore(wrapper, element)
    wrapper.appendChild(element)
    element.classList.remove('parallax-bg')
  })
  document.querySelectorAll('.parallax-background').forEach(element => {
    const movement = 25
    const current = window.pageYOffset
    const start = element.getBoundingClientRect().top + window.pageYOffset - window.innerHeight
    const end = element.getBoundingClientRect().bottom + window.pageYOffset
    const offset = utilities.scaleValue(current, [start, end], [-1 * movement, 0])
    element.children[0].style.height = `${100 + movement}%`
    element.children[0].style.top = `${offset}%`
  })
  document.querySelectorAll('.parallax').forEach(element => {
    const cssProperties = []
    const dataParallaxStart = element.getAttribute('data-parallax-start')
    const dataParallaxEnd = element.getAttribute('data-parallax-end')
    if (dataParallaxStart && dataParallaxEnd) {
      const startPropertiesAndValues = dataParallaxStart.split(';').map(propertiesAndValues => {
        const propertyAndValue = propertiesAndValues.trim().split(':')
        return {
          property: propertyAndValue[0].trim(),
          value: propertyAndValue[1].trim()
        }
      })
      const endPropertiesAndValues = dataParallaxEnd.split(';').map(propertiesAndValues => {
        const propertyAndValue = propertiesAndValues.trim().split(':')
        return {
          property: propertyAndValue[0].trim(),
          value: propertyAndValue[1].trim()
        }
      })
      startPropertiesAndValues.forEach(startPropertyAndValue => {
        endPropertiesAndValues.forEach(endPropertyAndValue => {
          if (startPropertyAndValue.property === endPropertyAndValue.property) {
            cssProperties.push({
              property: startPropertyAndValue.property,
              start: startPropertyAndValue.value,
              end: endPropertyAndValue.value
            })
          }
        })
      })
    }
    if (!cssProperties.length) {
      cssProperties.push({ property: 'transform', start: 'translateY(-30px)', end: 'translateY(30px)' })
    }
    const current = window.pageYOffset
    const start = element.getBoundingClientRect().top + window.pageYOffset - window.innerHeight
    const end = element.getBoundingClientRect().bottom + window.pageYOffset
    cssProperties.forEach(cssProperty => {
      const startNumbers = cssProperty.start.match(/-?\d*\.?\d/g)
      const endNumbers = cssProperty.end.match(/-?\d*\.?\d/g)
      let tempValue = cssProperty.start.replace(/-?\d*\.?\d/g, '~~~')
      let i = 0
      element.style[cssProperty.property] = tempValue.replace(/~~~/g, v => {
        const value = utilities.scaleValue(current, [start, end], [Number(startNumbers[i]), Number(endNumbers[i])])
        i++
        return value
      })
    })
  })
}

export { init, parallaxEvent }
