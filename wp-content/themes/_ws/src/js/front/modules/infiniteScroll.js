import * as utilities from 'Utilities'
import * as lazy from './lazy.js'

function init() {
  document.querySelectorAll('.infinite-scroll').forEach(el => {
    const load = document.createElement('div')
    load.classList.add('col-xs-12')
    load.classList.add('load-more')
    load.innerHTML = 'Loading...'
    el.appendChild(load)
  })
  function scrollsEvent(e) {
    document.querySelectorAll('.infinite-scroll').forEach((el, i) => {
      const load = el.querySelector('.load-more')
      if (utilities.onScreen(load, '-200px')) {
        const loop = el.querySelector('.loop-var') ? el.querySelector('.loop-var').value : ''
        const type = el.hasAttribute('data-type') ? `&type=${el.getAttribute('data-type')}` : ''
        const url = `/wp-admin/admin-ajax.php?action=_ws_get_more_posts&paged=${(el.getAttribute('paged') || '2')}&loop=${encodeURIComponent(loop)}${type}`
        utilities.handleAjax(url, scrollSuccess, scrollFail, { el: el, callback: scrollsEvent })
      }
    })
  }
  window.removeEventListener('throttleScroll', scrollsEvent, false)
  window.addEventListener('throttleScroll', scrollsEvent, false)
}

function scrollSuccess(data, args) {
  const load = args.el.querySelector('.load-more')
  const paged = args.el.getAttribute('paged')
  load.insertAdjacentHTML('beforebegin', data.output)
  args.el.setAttribute('paged', paged ? parseInt(paged) + 1 : 3)
  if (!data.more) {
    load.parentNode.removeChild(load)
  }
  lazy.init()
  args.callback()
}

function scrollFail(args) {
  const load = args.el.querySelector('.load-more')
  load.outerHTML = 'We are sorry, but it appears that something has gone wrong. Please try again at a later time.'
}

export { init, scrollSuccess, scrollFail }
