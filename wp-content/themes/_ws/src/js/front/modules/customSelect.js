import * as utilities from 'Utilities'

function init() {
  replaceHTML()
  addDocumentListener()
}

function replaceHTML() {
  document.querySelectorAll('select').forEach(el => {
    const id = el.hasAttribute('id') ? el.getAttribute('id') : `${utilities.uniqid()}`
    const name = el.hasAttribute('name') ? `name="${el.getAttribute('name')}"` : ''
    const label = document.querySelector(`[for="${id}"]`)
    if (label && !label.hasAttribute('id')) {
      label.setAttribute('id', utilities.uniqid())
    }
    let selected = { name: ' ', value: '' }
    let options = []
    el.querySelectorAll('option').forEach(option => {
      const obj = { name: option.text, value: option.value }
      selected = option.selected ? obj : selected
      options.push(obj)
    })
    el.insertAdjacentHTML('afterend',
      `<div class="listbox">
        <button ${id ? `id="listbox-${id}"` : ''} aria-haspopup="listbox" aria-labelledby="${label ? label.id : ''} ${id ? `listbox-${id}` : ''}">${selected.name}</button>
        <ul tabindex="-1" role="listbox" aria-labelledby="${label ? label.id : ''}">
          ${options.map(option => `<li id="${utilities.uniqid()}" role="option" data-value="${option.value}" ${option.value === selected.value ? 'class="selected"' : ''}>${option.name}</li>`).join('')}
        </ul>
        <input ${id ? `id="${id}"` : ''} class="hidden-input" ${name} value="${selected.value}" type="hidden" />
      </div>`
    )
    const newSelect = el.parentNode.querySelector('.listbox')
    el.parentNode.removeChild(el)
    addListboxListeners(newSelect)
  })
}

function addListboxListeners(el) {
  const button = el.querySelector('button')
  const list = el.querySelector('ul')
  const options = el.querySelectorAll('li')
  // If we click button
  button.addEventListener('click', buttonClick)
  button.addEventListener('keydown', e => {
    if (e.keyCode === utilities.keyCodes.ENTER) {
      e.preventDefault()
    }
  })
  button.addEventListener('keyup', e => {
    if (e.keyCode === utilities.keyCodes.ENTER) {
      buttonClick(e)
    }
  })
  list.addEventListener('keydown', e => {
    const selection = list.querySelector('.selected')
    if (e.keyCode === utilities.keyCodes.ARROW_UP) {
      e.preventDefault()
      if (selection.previousElementSibling) {
        selectOption(selection.previousElementSibling)
      }
    }
    if (e.keyCode === utilities.keyCodes.ARROW_DOWN) {
      e.preventDefault()
      if (selection.nextElementSibling) {
        selectOption(selection.nextElementSibling)
      }
    }
    if (e.keyCode === utilities.keyCodes.TAB) {
      cancelListbox(el)
      closeListbox(el, true)
    }
  })
  list.addEventListener('keyup', e => {
    const selection = list.querySelector('.selected')
    if (e.keyCode === utilities.keyCodes.ENTER) {
      changeInput(el, selection)
      closeListbox(el, true)
    }
    if (e.keyCode === utilities.keyCodes.ESCAPE) {
      cancelListbox(el)
      closeListbox(el, true)
    }
  })
  // If we click a list item
  options.forEach(option => {
    option.addEventListener('click', e => {
      selectOption(option)
      changeInput(el, option)
      closeListbox(el, true)
    })
  })
}

function addDocumentListener() {
  document.addEventListener('click', e => {
    // If we click outside the list
    if (!utilities.checkParents(e.target, '.listbox')) {
      document.querySelectorAll('.listbox').forEach(listbox => {
        closeListbox(listbox, false)
      })
    }
  })
}

function buttonClick(e) {
  e.preventDefault()
  const listbox = e.target.parentElement
  if (listbox.classList.contains('open')) {
    closeListbox(listbox)
  }
  else {
    openListbox(listbox)
  }
}

function openListbox(listbox) {
  const list = listbox.querySelector('ul')
  listbox.classList.add('open')
  list.setAttribute('tabindex', '0')
  list.focus()
  listbox.querySelector('button').setAttribute('aria-expanded', 'true')
}

function cancelListbox(listbox) {
  const input = listbox.querySelector('.hidden-input')
  const options = listbox.querySelectorAll('li')
  options.forEach(option => {
    option.classList.remove('selected')
    if (option.getAttribute('data-value') === input.value) {
      option.classList.add('selected')
    }
  })
}

function closeListbox(listbox, focus) {
  const button = listbox.querySelector('button')
  const list = listbox.querySelector('ul')
  listbox.classList.remove('open')
  list.setAttribute('tabindex', '-1')
  button.removeAttribute('aria-expanded')
  if (focus) {
    button.focus()
  }
}

function selectOption(selection) {
  const listbox = selection.parentElement.parentElement
  const list = selection.parentElement
  listbox.querySelectorAll('li').forEach(option => {
    option.classList.remove('selected')
  })
  selection.classList.add('selected')
  list.setAttribute('aria-activedescendant', selection.getAttribute('id'))
}

function changeInput(listbox, selection) {
  const input = listbox.querySelector('.hidden-input')
  const button = listbox.querySelector('button')
  button.innerHTML = selection.innerHTML
  input.value = selection.getAttribute('data-value')
  let event = document.createEvent('Event')
  event.initEvent('change', true, true)
  input.dispatchEvent(event)
}

export { init }
