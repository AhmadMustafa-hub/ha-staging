function init() {
  function minMaxCallback(e) {
    if (this.value > parseInt(this.getAttribute('max'))) {
      this.value = this.getAttribute('max')
    }
    else if (this.value < parseInt(this.getAttribute('min'))) {
      this.value = this.getAttribute('min')
    }
  }
  document.querySelectorAll('input[type=number]').forEach(el => {
    if (el.hasAttribute('min') || el.hasAttribute('max')) {
      el.addEventListener('input', minMaxCallback)
      el.addEventListener('keypress', minMaxCallback)
    }
  })
}

export { init }
