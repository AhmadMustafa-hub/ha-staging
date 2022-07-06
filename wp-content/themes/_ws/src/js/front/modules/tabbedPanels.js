import * as utilities from 'Utilities'
import { lazyEvent } from './lazy.js'

function init() {
  document.querySelectorAll('.wp-block-ws-tabbed-panels').forEach(tp => {
    initTabPanel(tp)
    addTabbedPanelsListener(tp)
    selectTab(tp.querySelector('.tab:first-child'), tp, false)
  })
}

function initTabPanel(tp) {
  const panels = tp.querySelectorAll('.panel')
  const tabContainer = tp.querySelector('.tabs')
  tabContainer.setAttribute('role', 'tablist')
  let tabs = ''
  panels.forEach((panel, i) => {
    const uid = panel.getAttribute('id').slice(6)
    const heading = panel.getAttribute('data-heading')
    // Setup tabs
    tabs += `<button
      id="tab-${uid}"
      class="tab"
      role="tab"
      aria-selected="false"
      aria-controls="panel-${uid}"
      tabindex="-1"
    >${heading}</button>`
    // Setup panel
    panel.setAttribute('role', 'tabpanel')
    panel.setAttribute('aria-labelledby', `tab-${uid}`)
    panel.setAttribute('tabindex', '0')
    panel.setAttribute('hidden', 'hidden')
  })
  tabContainer.innerHTML = tabs
}

function addTabbedPanelsListener(tp) {
  const tabs = tp.querySelectorAll('.tab')
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', e => {
      selectTab(tab, tp)
    })
    tab.addEventListener('keydown', e => {
      if (e.keyCode === utilities.keyCodes.ARROW_UP || e.keyCode === utilities.keyCodes.ARROW_DOWN) {
        e.preventDefault()
      }
    })
    tab.addEventListener('keyup', e => {
      // Desktop keyboard controls
      if (window.innerWidth > 768) {
        if (e.keyCode === utilities.keyCodes.ARROW_LEFT) {
          if (i === 0) {
            selectTab(tabs[tabs.length - 1], tp)
          }
          else {
            selectTab(tabs[i - 1], tp)
          }
        }
        if (e.keyCode === utilities.keyCodes.ARROW_RIGHT) {
          if (i === tabs.length - 1) {
            selectTab(tabs[0], tp)
          }
          else {
            selectTab(tabs[i + 1], tp)
          }
        }
      }
      // Mobile keybaord controls
      else {
        if (e.keyCode === utilities.keyCodes.ARROW_UP) {
          if (i === 0) {
            selectTab(tabs[tabs.length - 1], tp)
          }
          else {
            selectTab(tabs[i - 1], tp)
          }
        }
        if (e.keyCode === utilities.keyCodes.ARROW_DOWN) {
          if (i === tabs.length - 1) {
            selectTab(tabs[0], tp)
          }
          else {
            selectTab(tabs[i + 1], tp)
          }
        }
      }
    })
  })
}

function selectTab(tab, tp, focus = true) {
  const tabs = tp.querySelectorAll('.tab')
  const panels = tp.querySelectorAll('.panel')
  // Clear tabs
  tabs.forEach(tab => {
    tab.classList.remove('current')
    tab.setAttribute('aria-selected', false)
    tab.setAttribute('tabindex', -1)
  })
  // Clear panels
  panels.forEach(panel => {
    panel.classList.remove('current')
    panel.setAttribute('hidden', 'hidden')
  })
  // Select tab
  const panel = tp.querySelector(`#${tab.getAttribute('aria-controls')}`)
  tab.classList.add('current')
  tab.setAttribute('aria-selected', true)
  tab.removeAttribute('tabindex', true)
  if (focus) { // Prevents the page from scrolling to element when run in init()
    tab.focus()
  }
  panel.classList.add('current')
  panel.removeAttribute('hidden')
  lazyEvent()
}

export { init }
