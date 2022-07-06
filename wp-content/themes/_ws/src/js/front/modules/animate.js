import { CountUp } from 'countup.js'
// import lottie from 'lottie-web/build/player/lottie_light'
import * as utilities from 'Utilities'

function init() {
  // document.querySelectorAll('.svg-animation').forEach(el => {
  //   lottie.loadAnimation({
  //     container: el,
  //     renderer: 'svg',
  //     autoplay: false,
  //     animationData: JSON.parse(decodeURIComponent(el.getAttribute('data-src')).replace(/\+/g, ' ')),
  //     name: el.getAttribute('data-name'),
  //     rendererSettings: {
  //       preserveAspectRatio: 'xMinYMid meet'
  //     }
  //   })
  // })
  animateEvent()
  window.addEventListener('load', () => {
    animateEvent()
  })
  window.removeEventListener('throttleScroll', animateEvent, false)
  window.addEventListener('throttleScroll', animateEvent, false)
  document.querySelectorAll('.count-up').forEach(el => {
    const n = el.innerHTML.match(/[0-9,.]+/g)
    if (n) {
      el.setAttribute('data-count', el.innerHTML)
      const s = el.getAttribute('data-count').split(n[0])
      el.innerHTML = `${s[0]}0${s[1]}`
    }
  })
}

function animateEvent() {
  counterEvent()
  // svgEvent()
  elementEvent()
  // Creates waterfall effect over several elements
  document.querySelectorAll('.animate-group').forEach(el => {
    if (utilities.onScreen(el, '100px') || utilities.onScreen(el, '100%')) {
      el.classList.add('animating')
      el.classList.remove('animate-group')
      el.querySelectorAll('.animate').forEach((child, i, children) => {
        setTimeout(() => {
          child.classList.add('animation-done')
          child.classList.remove('animate')
          if (i >= children.length - 1) {
            el.classList.remove('animating')
          }
        }, i * 100)
      })
    }
  })
}

function elementEvent() {
  document.querySelectorAll('.animate').forEach(el => {
    // Already animating
    if (utilities.checkParents(el, '.animate-group, .animating')) {
      return // eslint-disable-line no-useless-return
    }
    // Animate when completely in window
    else if (el.classList.contains('animate-100')) {
      if (utilities.onScreen(el, '100%')) {
        el.classList.add('animation-done')
        el.classList.remove('animate')
      }
    }
    // Animate when 100px into window
    else {
      if (utilities.onScreen(el, '100px')) {
        el.classList.add('animation-done')
        el.classList.remove('animate')
      }
    }
  })
}

// function svgEvent() {
//   document.querySelectorAll('.svg-animation').forEach(el => {
//     if (utilities.onScreen(el, '100%')) {
//       lottie.play(el.getAttribute('data-name'))
//       el.classList.remove('svg-animation')
//     }
//   })
// }

function counterEvent() {
  document.querySelectorAll('.count-up[data-count]').forEach(el => {
    if (utilities.onScreen(el, '100px')) {
      el.classList.remove('count-up')
      let n = el.getAttribute('data-count').match(/[0-9,.]+/g)
      if (n) {
        n = n[0]
        const s = el.getAttribute('data-count').split(n)
        const d = n.indexOf('.') !== -1 ? n.substring(n.indexOf('.') + 1).length : 0
        const countUp = new CountUp(el, n, { duration: 2.5, decimalPlaces: d, prefix: s[0], suffix: s[1] })
        countUp.start()
      }
    }
  })
}

export { init, animateEvent }
