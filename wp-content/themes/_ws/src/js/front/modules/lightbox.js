import * as utilities from 'Utilities'

function init() {
  document.addEventListener('click', (e) => {
    const button = utilities.checkParents(e.target, '.lightbox-button')
    if (button) {
      e.preventDefault()
      openLightbox(button)
    }
  })
}

function handleFocus(e) {
  e.preventDefault()
  e.target.focus({ preventScroll: true })
  if (e.relatedTarget) {
    e.relatedTarget.focus()
  }
  else {
    document.querySelector('.lightbox-close').focus()
  }
}

function openLightbox(button) {
  const url = button.getAttribute('data-url')
  const lb = document.createElement('div')
  lb.classList.add('lightbox')
  lb.setAttribute('role', 'dialog')
  lb.setAttribute('aria-modal', 'true')
  lb.innerHTML = `<div class="container">
    <div class="row align-items-center">
      <div class="col">
        <div class="lightbox-content wp-embed-responsive">
          <button class="lightbox-close" aria-label="Close Lightbox">
            <svg viewBox="0 0 24 24" fill-rule="evenodd">
              <title>Close</title>
              <path d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm0 1c6.071 0 11 4.929 11 11s-4.929 11-11 11-11-4.929-11-11 4.929-11 11-11zm0 10.293l5.293-5.293.707.707-5.293 5.293 5.293 5.293-.707.707-5.293-5.293-5.293 5.293-.707-.707 5.293-5.293-5.293-5.293.707-.707 5.293 5.293z"/>
            </svg>
          </button>
          <div class="wp-block-embed is-type-rich is-provider-embed-handler wp-embed-aspect-16-9 wp-has-aspect-ratio">
            <div class="wp-block-embed__wrapper">
              <iframe src="${url}" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`
  document.body.insertBefore(lb, document.body.firstChild)
  utilities.trapFocus(lb, handleFocus)
  document.body.classList.add('no-scroll')
  window.setTimeout(() => {
    lb.querySelector('button').focus()
    lb.classList.add('show')
    document.addEventListener('keyup', function handleEsc(e) {
      if (e.keyCode === utilities.keyCodes.ESCAPE) {
        document.removeEventListener(e.type, handleEsc)
        closeLightbox(lb, button)
      }
    })
    document.querySelector('.lightbox-close').addEventListener('click', function handleClose(e) {
      this.removeEventListener(e.type, handleClose)
      closeLightbox(lb, button)
    })
  }, 0)
}

function closeLightbox(lightbox, button) {
  // Remove trapFocus listeners
  utilities.releaseFocus(lightbox, handleFocus)
  lightbox.classList.remove('show')
  lightbox.addEventListener(utilities.transitionEvent, function handleTransition(e) {
    lightbox.removeEventListener(e.type, handleTransition)
    document.body.classList.remove('no-scroll')
    try {
      button.focus()
      lightbox.parentElement.removeChild(lightbox)
    }
    catch (err) {
      console.error(err)
    }
  })
}

export { init, openLightbox, closeLightbox }
