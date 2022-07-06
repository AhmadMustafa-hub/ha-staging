function init() {
  function receiveMessage(e) {
    if (e.origin !== 'https://iframe.url.com') {
      return
    }
    if (e.data.height) {
      if (e.data.name) {
        document.querySelector(`iframe[name="${e.data.name}"]`).style.height = `${e.data.height}px`
      }
      else if (e.data.url) {
        document.querySelector(`iframe[src="${e.data.url}"]`).style.height = `${e.data.height}px`
      }
    }
  }
  window.addEventListener('message', receiveMessage, false)

  // Don't use this function here, use it in the iframe
  // window.addEventListener('load', function() {
  //   sendMessage()
  // })
  // window.addEventListener('resize', function() {
  //   sendMessage()
  // })
  // function sendMessage() {
  //   const docHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight)
  //   if (window.location.href) {
  //     window.parent.postMessage({ 'url': window.location.href, 'height': docHeight }, '*')
  //   }
  // }
}

export { init }
