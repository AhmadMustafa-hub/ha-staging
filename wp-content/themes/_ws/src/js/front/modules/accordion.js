import * as utilities from 'Utilities'

function init() {
  document.querySelectorAll('.accordion-button').forEach(el => {
    const target = document.querySelector(`#${el.getAttribute('aria-controls')}`)
    el.addEventListener('click', function(e) {
      e.preventDefault()
      if (this.classList.contains('animating')) {
        return
      }
      if (this.classList.contains('closed')) {
        openAccordion(this, target)
      }
      else {
        closeAccordion(this, target)
      }
    })
  })
  document.querySelectorAll('.ws-block-read-more').forEach(el => {
    const readMore = el.querySelector('.read-more-button')
    const close = el.querySelector('.close-button')
    const target = el.querySelector('.full-text')
    readMore.addEventListener('click', function(e) {
      e.preventDefault()
      if (!readMore.classList.contains('animating') && !close.classList.contains('animating')) {
        openAccordion(this, target)
        readMore.classList.add('hide')
        close.classList.remove('hide')
      }
    })
    close.addEventListener('click', function(e) {
      e.preventDefault()
      if (!readMore.classList.contains('animating') && !close.classList.contains('animating')) {
        closeAccordion(this, target)
        readMore.classList.remove('hide')
        close.classList.add('hide')
      }
    })
  })
}

function openAccordion(button, target) {
  button.classList.add('animating')
  target.style.height = '0px'
  target.classList.remove('closed')
  target.classList.add('open')
  target.removeAttribute('hidden')
  button.classList.remove('closed')
  button.classList.add('open')
  target.style.height = `${target.scrollHeight}px`
  target.addEventListener(utilities.transitionEvent, function autoHeight1(e) {
    button.setAttribute('aria-expanded', true)
    this.removeEventListener(e.type, autoHeight1)
    button.classList.remove('animating')
  })
}

function closeAccordion(button, target) {
  button.classList.add('animating')
  target.style.height = '0px'
  target.classList.remove('open')
  target.classList.add('closed')
  button.classList.remove('open')
  button.classList.add('closed')
  target.addEventListener(utilities.transitionEvent, function autoHeight2(e) {
    button.setAttribute('aria-expanded', false)
    target.setAttribute('hidden', 'hidden')
    this.removeEventListener(e.type, autoHeight2)
    button.classList.remove('animating')
  })
}

export { init }
