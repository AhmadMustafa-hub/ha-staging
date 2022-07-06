function init() {
  const headerClose = document.querySelector('.header-banner-close')
  if (headerClose) {
    headerClose.addEventListener('click', e => {
      e.preventDefault()
      const headerBanner = document.querySelector('.header-banner')
      const id = headerBanner.getAttribute('id')
      headerBanner.style.display = 'none'
      const d = new Date()
      const days = 30
      d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000))
      document.cookie = `${id}BannerDismissed=1; expires=${d.toUTCString()}; path=/`
    })
  }
}

export { init }
