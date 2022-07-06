import * as utilities from 'Utilities'

function clickTab(tab, tabs, panels, interval) {
  let prev
  panels.forEach(p => {
    if (p.classList.contains('current')) {
      prev = p
    }
  })
  // Stop timer
  if (interval) {
    clearInterval(interval)
    interval = null
    tabs.forEach(t => {
      t.classList.remove('timer')
      t.nextElementSibling.style.removeProperty('transition-duration')
    })
  }
  // Clear tabs
  tabs.forEach(tab => {
    tab.setAttribute('aria-selected', false)
    tab.setAttribute('tabindex', -1)
    tab.classList.remove('current')
  })
  // Clear panels
  panels.forEach(panel => {
    panel.setAttribute('tabindex', -1)
    panel.setAttribute('hidden', 'hidden')
    panel.classList.remove('current')
    panel.classList.remove('previous')
  })
  // Modify current
  if (prev) {
    prev.classList.add('previous')
    prev.addEventListener(utilities.transitionEvent, function resetSlide(e) {
      this.classList.remove('previous')
      this.removeEventListener(e.type, resetSlide)
    })
  }
  tab.setAttribute('aria-selected', true)
  tab.setAttribute('tabindex', 0)
  tab.classList.add('current')
  document.querySelector(`#${tab.getAttribute('aria-controls')}`).setAttribute('tabindex', 0)
  document.querySelector(`#${tab.getAttribute('aria-controls')}`).setAttribute('hidden', '')
  document.querySelector(`#${tab.getAttribute('aria-controls')}`).classList.add('current')
  const video = document.querySelector(`#${tab.getAttribute('aria-controls')} video`)
  if (video) {
    video.pause()
    if (video.duration) {
      video.currentTime = 0
    }
    video.play()
  }
}

function init() {
  initSliders()
  initCardSliders()
}

function initSliders() {
  document.querySelectorAll('.ws-block-slider, .ws-block-testimonial').forEach(el => {
    if (!el.querySelector('.slider-container')) {
      return
    }
    const tabs = el.querySelectorAll('[role=tab]')
    const panels = el.querySelectorAll('[role=tabpanel]')
    const timer = el.querySelector('.slider-container').getAttribute('data-timer')
    let interval
    if (timer && timer !== '0') {
      window.addEventListener('throttleScroll', function startSlider() {
        if (utilities.onScreen(el, '0%')) {
          interval = setInterval(e => {
            const current = el.querySelector('[aria-selected=true]')
            current.nextElementSibling.style.transitionDuration = '0s'
            const next = current.parentElement.nextElementSibling ? current.parentElement.nextElementSibling.firstElementChild : el.querySelector('.tab-container:first-child .tab')
            next.classList.add('timer')
            next.nextElementSibling.style.transitionDuration = timer - 0.1 + 's'
            clickTab(next, tabs, panels)
          }, timer * 1000)
          window.removeEventListener('throttleScroll', startSlider, false)
          const init = el.querySelector('.tab-container:first-child .tab')
          init.classList.add('timer')
          init.nextElementSibling.style.transitionDuration = timer - 0.1 + 's'
          clickTab(init, tabs, panels)
        }
      }, false)
    }
    else {
      clickTab(el.querySelector('.tab-container:first-child .tab'), tabs, panels)
    }
    tabs.forEach(tab => {
      tab.addEventListener('click', e => {
        clickTab(tab, tabs, panels, interval)
        tab.focus()
      })
      tab.addEventListener('keydown', e => {
        if (e.keyCode === utilities.keyCodes.ARROW_UP || e.keyCode === utilities.keyCodes.ARROW_DOWN || e.keyCode === utilities.keyCodes.ARROW_LEFT || e.keyCode === utilities.keyCodes.ARROW_RIGHT) {
          e.preventDefault()
        }
      })
      tab.addEventListener('keyup', e => {
        if (window.innerWidth >= 768) {
          if (e.keyCode === utilities.keyCodes.ARROW_UP) {
            e.preventDefault()
            const prev = tab.parentElement.previousElementSibling
            if (prev) {
              clickTab(prev.children[0], tabs, panels, interval)
              prev.children[0].focus()
            }
          }
          if (e.keyCode === utilities.keyCodes.ARROW_DOWN) {
            e.preventDefault()
            const next = tab.parentElement.nextElementSibling
            if (next) {
              clickTab(next.children[0], tabs, panels, interval)
              next.children[0].focus()
            }
          }
        }
        else {
          if (e.keyCode === utilities.keyCodes.ARROW_LEFT) {
            e.preventDefault()
            const prev = tab.parentElement.previousElementSibling
            if (prev) {
              clickTab(prev.children[0], tabs, panels, interval)
              prev.children[0].focus()
            }
          }
          if (e.keyCode === utilities.keyCodes.ARROW_RIGHT) {
            e.preventDefault()
            const next = tab.parentElement.nextElementSibling
            if (next) {
              clickTab(next.children[0], tabs, panels, interval)
              next.children[0].focus()
            }
          }
        }
      })
    })
  })
}

function cardSliderEvent(accordion, accordions) {
  accordions.forEach(accordion => {
    const tab = accordion.querySelector('.slider-button')
    const panel = accordion.querySelector('.hover-text')
    accordion.classList.remove('current')
    tab.setAttribute('aria-expanded', 'false')
    tab.setAttribute('aria-disabled', 'false')
    panel.hidden = true
    panel.setAttribute('tabindex', -1)
    // panel.querySelectorAll('a, button, input').forEach(el => {
    //   el.setAttribute('tabindex', -1)
    // })
  })
  const tab = accordion.querySelector('.slider-button')
  const panel = accordion.querySelector('.hover-text')
  accordion.classList.add('current')
  tab.setAttribute('aria-expanded', 'true')
  tab.setAttribute('aria-disabled', 'true')
  panel.removeAttribute('hidden')
  panel.setAttribute('tabindex', 0)
  // panel.querySelectorAll('a, button, input').forEach(el => {
  //   el.setAttribute('tabindex', 0)
  // })
}

function initCardSliders() {
  let animating = false
  document.querySelectorAll('.ws-block-card-slider').forEach(el => {
    const accordions = el.querySelectorAll('.desktop-item')
    cardSliderEvent(accordions[0], accordions)
    accordions.forEach(accordion => {
      accordion.querySelector('.slider-button').addEventListener('click', e => {
        cardSliderEvent(accordion, accordions)
      })
    })
    const prev = el.querySelector('.arrow-prev')
    const next = el.querySelector('.arrow-next')
    const current = el.querySelector('.mobile-item:first-child')
    current.classList.add('current')
    current.setAttribute('tabindex', 0)
    current.setAttribute('aria-hidden', 'false')
    next.addEventListener('click', e => {
      e.preventDefault()
      if (!animating) {
        animating = true
        const current = el.querySelector('.current')
        const next = el.querySelector('.current').nextElementSibling || el.querySelector('li:first-child')
        current.setAttribute('tabindex', -1)
        current.setAttribute('aria-hidden', 'true')
        next.setAttribute('tabindex', 0)
        next.setAttribute('aria-hidden', 'false')
        next.classList.add('next')
        next.addEventListener(utilities.animationEvent, e => {
          current.classList.remove('current')
          next.classList.add('current')
          next.classList.remove('next')
          animating = false
        })
      }
    })
    prev.addEventListener('click', e => {
      e.preventDefault()
      if (!animating) {
        animating = true
        const current = el.querySelector('.current')
        const prev = el.querySelector('.current').previousElementSibling || el.querySelector('li:last-child')
        current.setAttribute('tabindex', -1)
        // current.querySelectorAll('input, button, a').forEach(a => {
        //   a.setAttribute('tabindex', -1)
        // })
        current.setAttribute('aria-hidden', 'true')
        prev.setAttribute('tabindex', 0)
        // prev.querySelectorAll('input, button, a').forEach(a => {
        //   a.setAttribute('tabindex', 0)
        // })
        prev.setAttribute('aria-hidden', 'false')
        prev.classList.add('prev')
        prev.addEventListener(utilities.animationEvent, e => {
          current.classList.remove('current')
          prev.classList.add('current')
          prev.classList.remove('prev')
          animating = false
        })
      }
    })
  })
}

export { init }
