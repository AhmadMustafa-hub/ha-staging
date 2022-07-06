function addHeadingMenuListeners(headingDiv) {
  const input = headingDiv.querySelector('#heading-menu-item-name')
  const submit = headingDiv.querySelector('#add-heading-menu-item')
  input.addEventListener('keypress', e => {
    headingDiv.classList.remove('form-invalid')
    if (e.keyCode === 13) {
      e.preventDefault()
      submit.click()
    }
  })
  submit.addEventListener('click', e => {
    const url = '#custom_heading'
    if (input.value === '') {
      headingDiv.classList.add('form-invalid')
      return false
    }
    headingDiv.querySelector('.spinner').classList.add('is-active')
    window.wpNavMenu.addLinkToMenu(url, input.value, window.wpNavMenu.addMenuItemToBottom, function() {
      headingDiv.querySelector('.spinner').classList.remove('is-active')
      input.value = ''
      input.blur()
    })
  })
}

function addSearchMenuListeners(searchDiv) {
  const submit = searchDiv.querySelector('#add-search-menu-item')
  submit.addEventListener('click', e => {
    const url = '#custom_search'
    searchDiv.querySelector('.spinner').classList.add('is-active')
    window.wpNavMenu.addLinkToMenu(url, 'Search', window.wpNavMenu.addMenuItemToBottom, function() {
      searchDiv.querySelector('.spinner').classList.remove('is-active')
    })
  })
}

function init() {
  const headingDiv = document.querySelector('#headingdiv')
  const searchDiv = document.querySelector('#searchdiv')
  if (headingDiv) {
    addHeadingMenuListeners(headingDiv)
  }
  if (searchDiv) {
    addSearchMenuListeners(searchDiv)
  }
}

export { init }
