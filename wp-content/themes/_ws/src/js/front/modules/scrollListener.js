function init() {
  let ticking = false
  let scrollEvent = document.createEvent('Event')
  scrollEvent.initEvent('throttleScroll', true, true)
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        window.dispatchEvent(scrollEvent)
        ticking = false
      })
      ticking = true
    }
  }, { passive: true })
}

export { init }
