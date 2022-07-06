import * as utilities from 'Utilities'

function init() {
  document.addEventListener('click', (e) => {
    const shareButton = utilities.checkParents(e.target, '.share-button')
    if (shareButton) {
      e.preventDefault()
      window.open(shareButton.getAttribute('href'), shareButton.getAttribute('target'), 'resizeable,width=550,height=520')
    }
  })
}

export { init }
