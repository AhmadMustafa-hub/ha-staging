import * as utilities from 'Utilities'
import { buttonEvent } from './infiniteButton.js'

function init() {
  const form = document.querySelector('.archive-filters')
  if (form) {
    // Submit form once on initialization
    submitFormAjax(form, false)
    // Add future submit listeners
    form.addEventListener('submit', e => {
      e.preventDefault()
      submitFormAjax(form)
    })
    // Add history listeners (back button)
    window.addEventListener('popstate', e => {
      if (e.state && e.state.filter) {
        history.replaceState(e.state, null, `?${e.state.parameters}`)
      }
      if (!window.location.hash) {
        updateInputs(window.location.search.slice(1))
        submitFormAjax(form, false)
      }
    })
    // Add filter listeners
    document.querySelectorAll('.archive-filters select, .archive-filters .listbox input').forEach(el => {
      el.addEventListener('change', e => {
        submitFormAjax(form)
      })
    })
  }
}

function submitFormAjax(form, updateHistory = true) {
  console.log('submit')
  const loopQuery = {
    post_type: 'any',
    post_status: 'publish'
  }
  // Convert form values to query object
  const serialized = utilities.serializeForm(form)
  serialized.split('&').forEach(pair => {
    const temp = pair.split('=')
    const key = temp[0]
    const value = temp[1]
    if (value) {
      if (key.substring(0, 7) === 'filter-') {
        if (loopQuery.tax_query === undefined) {
          loopQuery.tax_query = []
        }
        loopQuery.tax_query.push({
          'taxonomy': key.substring(7),
          'field': 'slug',
          'terms': value.split(',')
        })
      }
      else if (key === 'search') {
        loopQuery.s = value
      }
      else {
        loopQuery[temp[0]] = temp[1]
      }
    }
  })
  if (updateHistory) {
    const historyState = serialized.replace(/post_type=[^&]*&posts_per_page=[^&]*&?/, '')
    history.pushState({ filter: true, parameters: historyState }, null, `?${historyState}`)
  }
  const loopString = encodeURIComponent(JSON.stringify(loopQuery))
  const loopContainer = document.querySelector('.archive-results')
  loopContainer.setAttribute('data-paged', 1)
  loopContainer.innerHTML = `<input class="loop-var" type="hidden" value="${loopString}" />`
  buttonEvent(loopContainer)
}

function updateInputs(urlParameters) {
  // If empty reset all fields, otherwise set inputs to url values
  if (urlParameters === '') {
    const inputs = document.querySelectorAll('.archive-filters select, .archive-filters .listbox input, .archive-filters input:not([type=hidden])')
    inputs.forEach(input => {
      utilities.setFieldValue(input, '')
    })
  }
  else {
    urlParameters.split('&').forEach(keyValuePair => {
      const keyValue = keyValuePair.split('=')
      const input = document.querySelector(`[name="${keyValue[0]}"]`)
      utilities.setFieldValue(input, keyValue[1])
    })
  }
}

export { init }
