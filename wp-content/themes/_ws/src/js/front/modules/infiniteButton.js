import * as utilities from 'Utilities'
import * as lazy from './lazy.js'
import * as parallax from './parallax.js'

const buttonText = 'Load More'


function init() {
  document.removeEventListener('click', windowButtonEvent, false)
  document.addEventListener('click', windowButtonEvent, false)
}

function windowButtonEvent(e) {
  const button = utilities.checkParents(e.target, '.load-more button')
  if (button) {
    e.preventDefault()
    const loopContainer = utilities.checkParents(button, '.archive-results')
    if (loopContainer) {
      buttonEvent(loopContainer)
    }
  }
}

function buttonEvent(loopContainer) {
  if (!loopContainer.querySelector('.load-more button')) {
    loopContainer.innerHTML = `${loopContainer.innerHTML}<div class="col-xs-12 load-more"><button>${buttonText}</button></div>`
  }
  const button = loopContainer.querySelector('.load-more button')
  button.innerHTML = 'Loading...'
  button.disabled = true
  const loopString = loopContainer.querySelector('.loop-var') ? loopContainer.querySelector('.loop-var').value : ''
  const type = loopContainer.hasAttribute('data-type') ? `&type=${loopContainer.getAttribute('data-type')}` : ''
  const url = `/wp-admin/admin-ajax.php?action=_ws_get_more_posts&paged=${(loopContainer.getAttribute('data-paged') || '1')}&loop=${encodeURIComponent(loopString)}${type}`
  utilities.handleAjax(url, buttonSuccess, buttonFail, loopContainer)
}

function buttonSuccess(data, loopContainer) {
  const button = loopContainer.querySelector('.load-more button')
  button.parentNode.insertAdjacentHTML('beforebegin', data.output)
  button.innerHTML = buttonText
  button.disabled = false
  const paged = loopContainer.getAttribute('data-paged')
  loopContainer.setAttribute('data-paged', paged ? parseInt(paged) + 1 : 2)
  if (!data.more) {
    button.parentNode.removeChild(button)
  }
  const scripts = loopContainer.querySelectorAll('script')
  executeScripts(scripts)
  // loopContainer.classList.add('animate-group')
  // animate.animateEvent()
  lazy.lazyEvent()
  parallax.parallaxEvent()
}

function buttonFail(loopContainer) {
  const button = loopContainer.querySelector('.load-more button')
  if (button) {
    button.outerHTML = 'We are sorry, but it appears that something has gone wrong. Please try again at a later time.'
  }
}

function executeScripts(scripts) {
  let newScripts = []
  scripts.forEach(script => {
    const newScript = document.createElement('script')
    for (let i = 0; i < script.attributes.length; i++) {
      const attribute = script.attributes[i]
      newScript[attribute.name] = attribute.value
    }
    newScript.innerHTML = script.innerHTML
    newScripts.push(newScript)
  })
  newScripts = newScripts.reverse()
  newScripts.forEach((newScript, index) => {
    scripts[index].parentNode.insertBefore(newScript, scripts[index].parentNode.firstChild)
    scripts[index].parentNode.removeChild(scripts[index])
  })
}

export { init, buttonEvent, buttonSuccess, buttonFail }
