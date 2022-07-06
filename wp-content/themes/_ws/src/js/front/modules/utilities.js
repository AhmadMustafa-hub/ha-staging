// import { Promise } from '@babel/polyfill' // eslint-disable-line no-unused-vars
// import { fetch } from 'whatwg-fetch'

// Sets the correct transition-end event depending on browser
const transitionEvent = (function whichTransitionEvent() {
  const el = document.createElement('fakeelement')
  let transitions = {
    'transition': 'transitionend',
    'MozTransition': 'transitionend',
    'WebkitTransition': 'webkitTransitionEnd'
  }
  for (let t in transitions) {
    if (el.style[t] !== undefined) {
      return transitions[t]
    }
  }
})()

// Sets the correct animation-end event depending on browser
const animationEvent = (function whichAnimationEvent() {
  const el = document.createElement('fakeelement')
  let animations = {
    'animation': 'animationend',
    'MozAnimation': 'animationend',
    'WebkitAnimation': 'webkitAnimationEnd'
  }
  for (let a in animations) {
    if (el.style[a] !== undefined) {
      return animations[a]
    }
  }
})()

// Helper function to see if we're in a child element (for elements added dynamically)
function checkParents(el, selector) {
  let cur = el
  const all = document.querySelectorAll(selector)
  while (cur) {
    for (let i = 0; i < all.length; i++) {
      if (all[i] === cur) {
        return cur
      }
    }
    cur = cur.parentNode
  }
  return false
}

function handleAjax(url, success, fail, args) {
  const req = new XMLHttpRequest()
  req.open('GET', url, true)
  req.onload = () => {
    const data = JSON.parse(req.response)
    if (req.status === 200 && data) {
      success(data, args)
    }
    else {
      fail(args)
    }
  }
  req.onerror = () => {
    fail(args)
  }
  req.send()
}

// Helper function for scrolling
function onScreen(el, visible) {
  const rect = el.getBoundingClientRect()
  let visibleFromTop = false
  let visibleFromBottom = false
  // element is hidden
  if (el.offsetParent === null) {
    return false
  }
  // visible is a percentage
  if (visible[visible.length - 1] === '%') {
    visible = Number(visible.replace(/%/g, ''))
    visibleFromTop = 100 - (rect.top / rect.height * -100) > visible
    visibleFromBottom = 100 - ((rect.bottom - window.innerHeight) / rect.height * 100) > visible
  }
  // visible is in pixels
  else {
    visible = Number(visible.replace(/[px]+/g, ''))
    visibleFromTop = rect.bottom >= 0 + visible
    visibleFromBottom = rect.top < window.innerHeight - visible
  }
  return visibleFromTop && visibleFromBottom
}

// Prevent focus from leaving element children
function trapFocus(element, handleFocus) {
  if (handleFocus === undefined) {
    handleFocus = defaultFocusHandler
  }
  let preDiv = document.createElement('div')
  preDiv.tabIndex = 0
  element.insertBefore(preDiv, element.firstChild)
  let postDiv = document.createElement('div')
  postDiv.tabIndex = 0
  element.appendChild(postDiv)
  preDiv.addEventListener('focus', handleFocus)
  postDiv.addEventListener('focus', handleFocus)
}

function defaultFocusHandler(e) {
  e.preventDefault()
  e.target.focus({ preventScroll: true })
  e.relatedTarget.focus()
}

// Allow focus to leave element children
function releaseFocus(element, handleFocus) {
  if (handleFocus === undefined) {
    handleFocus = defaultFocusHandler
  }
  element.firstElementChild.removeEventListener('focus', handleFocus)
  element.lastElementChild.removeEventListener('focus', handleFocus)
  element.firstElementChild.parentNode.removeChild(element.firstElementChild)
  element.lastElementChild.parentNode.removeChild(element.lastElementChild)
}

function setFieldValue(element, value) {
  if (element.type && element.type === 'select-one') {
    const options = element.querySelectorAll(`option`)
    let index = false
    options.forEach((option, i) => {
      option.selected = false
      if (option.value === value) {
        index = i
      }
    })
    if (index !== false) {
      element.selectedIndex = index
    }
  }
  else {
    element.value = value
  }
}

// Helper function for sending form data via ajax
function serializeForm(form) {
  let s = []
  for (let i = 0; i < form.elements.length; i++) {
    const el = form.elements[i]
    if (el.name && !el.disabled && el.type !== 'file' && el.type !== 'reset' && el.type !== 'submit' && el.type !== 'button') {
      if (el.type === 'select-multiple') {
        el.options.forEach(option => {
          if (option.selected) {
            s[s.length] = `${encodeURIComponent(el.name)}=${encodeURIComponent(option.value)}`
          }
        })
      }
      else if ((el.type !== 'checkbox' && el.type !== 'radio') || el.checked) {
        s[s.length] = `${encodeURIComponent(el.name)}=${encodeURIComponent(el.value)}`
      }
    }
  }
  return s.join('&').replace(/%20/g, '+')
}

// Scale from one range to another
function scaleValue(value, from, to) {
  var scale = (to[1] - to[0]) / (from[1] - from[0])
  var capped = Math.min(from[1], Math.max(from[0], value)) - from[0]
  return capped * scale + to[0]
}

// Check if arrays are equal
function arraysMatch(arrayA, arrayB) {
  if (arrayA.length !== arrayB.length) {
    return false
  }
  for (let i = 0; i < arrayA.length; i++) {
    if (arrayA[i] !== arrayB[i]) {
      return false
    }
  }
  return true
}

// Check if objects are equal
function objectsMatch(objectA, objectB) {
  const aProps = Object.getOwnPropertyNames(objectA)
  const bProps = Object.getOwnPropertyNames(objectB)
  if (aProps.length !== bProps.length) {
    return false
  }
  for (let i = 0; i < aProps.length; i++) {
    const propName = aProps[i]
    if (objectA[propName] !== objectB[propName]) {
      return false
    }
  }
  return true
}

// Returns unique id
function uniqid() {
  const time = Date.now()
  const last = uniqid.last || time
  uniqid.last = time > last ? time : last + 1
  return uniqid.last.toString(36)
}

const keyCodes = {
  'ARROW_LEFT': 37,
  'ARROW_UP': 38,
  'ARROW_RIGHT': 39,
  'ARROW_DOWN': 40,
  'TAB': 9,
  'ENTER': 13,
  'ESCAPE': 27
}

export { transitionEvent, animationEvent, checkParents, handleAjax, onScreen, trapFocus, releaseFocus, setFieldValue, serializeForm, scaleValue, arraysMatch, objectsMatch, uniqid, keyCodes }
