import * as utilities from 'Utilities'

function init() {
  updateTabIndex()
  updateSubmenuHeights()
  scrollMenu()
  tabbableDesktopMenu()
  tabbableMobileMenu()
  keyboardDesktopMenu()
  keyboardMobileMenu()
  document.querySelector('.desktop-nav').addEventListener('mouseover', () => {
    document.querySelectorAll('.desktop-nav .menu-image.lazy-load').forEach(image => {
      image.style.backgroundImage = `url(${image.getAttribute('data-src')})`
      image.classList.remove('lazy-load')
    })
  })
}

function updateSubmenuHeights() {
  const firstLevelMenus = document.querySelectorAll('.desktop-nav .menu > .menu-item > .sub-menu')
  firstLevelMenus.forEach(firstLevelMenu => {
    let minHeight = firstLevelMenu.offsetHeight
    const secondLevelMenus = firstLevelMenu.querySelectorAll('.sub-menu')
    secondLevelMenus.forEach(secondLevelMenu => {
      minHeight = Math.max(minHeight, secondLevelMenu.offsetHeight)
    })
    firstLevelMenu.style.height = `${minHeight}px`
    secondLevelMenus.forEach(secondLevelMenu => {
      secondLevelMenu.style.height = `${minHeight}px`
    })
  })
}

function scrollMenu() {
  let lastScrollY = 0
  const menu = document.querySelector('.site-header')
  window.removeEventListener('throttleScroll', scrollMenuEvent, false)
  window.addEventListener('throttleScroll', scrollMenuEvent, false)
  function scrollMenuEvent() {
    if (window.pageYOffset < menu.offsetHeight) {
      menu.classList.add('header-scroll-top')
      menu.classList.remove('header-not-scroll-top')
    }
    else {
      menu.classList.remove('header-scroll-top')
      menu.classList.add('header-not-scroll-top')
      if (lastScrollY - window.pageYOffset >= 1) {
        menu.classList.add('header-scrolling-up')
      }
      else {
        menu.classList.remove('header-scrolling-up')
      }
    }
    lastScrollY = window.pageYOffset
  }
}

function tabbableDesktopMenu() {
  document.querySelectorAll('.desktop-nav .sub-menu a').forEach(subnav => {
    subnav.addEventListener('focus', e => {
      getParentNav(subnav, true)
    })
    subnav.addEventListener('blur', e => {
      getParentNav(subnav, false)
    })
  })
}

function tabbableMobileMenu() {
  document.querySelector('.mobile-nav .hamburger').addEventListener('click', function(e) {
    e.preventDefault()
    if (this.classList.contains('opened')) {
      closeMobileMenu(this)
    }
    else {
      openMobileMenu(this)
    }
  })
  document.querySelectorAll('.mobile-nav .dropdown').forEach(dropdown => {
    dropdown.addEventListener('click', function(e) {
      if (this.classList.contains('opened')) {
        closeMobileDropdown(this)
      }
      else {
        openMobileDropdown(this)
      }
    })
  })
}

function keyboardDesktopMenu() {
  document.querySelectorAll('.desktop-nav .menu > .menu-item > a, .desktop-nav .menu-search-form input').forEach((el, i, a) => {
    // Prevent keyboard scrolling
    el.addEventListener('keydown', e => {
      if (e.keyCode === utilities.keyCodes.ARROW_UP || e.keyCode === utilities.keyCodes.ARROW_DOWN) {
        e.preventDefault()
      }
    })
    const submenuItems = el.parentElement.querySelectorAll('.sub-menu a')
    el.addEventListener('keyup', e => {
      if (e.keyCode === utilities.keyCodes.ARROW_LEFT) {
        if (e.target.getAttribute('type') !== 'search') {
          goToIndex(i - 1, a).focus()
        }
      }
      if (e.keyCode === utilities.keyCodes.ARROW_RIGHT) {
        if (e.target.getAttribute('type') !== 'search') {
          goToIndex(i + 1, a).focus()
        }
      }
      if (submenuItems.length) {
        if (e.keyCode === utilities.keyCodes.ARROW_UP) {
          submenuItems[submenuItems.length - 1].focus()
        }
        if (e.keyCode === utilities.keyCodes.ARROW_DOWN) {
          submenuItems[0].focus()
        }
      }
    })
    if (submenuItems.length) {
      submenuItems.forEach((el2, i2, a2) => {
        // Prevent keyboard scrolling
        el2.addEventListener('keydown', e => {
          if (e.keyCode === utilities.keyCodes.ARROW_UP || e.keyCode === utilities.keyCodes.ARROW_DOWN) {
            e.preventDefault()
          }
        })
        el2.addEventListener('keyup', e => {
          if (e.keyCode === utilities.keyCodes.ARROW_UP) {
            goToIndex(i2 - 1, a2).focus()
          }
          if (e.keyCode === utilities.keyCodes.ARROW_DOWN) {
            goToIndex(i2 + 1, a2).focus()
          }
          if (e.keyCode === utilities.keyCodes.ARROW_LEFT) {
            goToIndex(i - 1, a).focus()
          }
          if (e.keyCode === utilities.keyCodes.ARROW_RIGHT) {
            goToIndex(i + 1, a).focus()
          }
          if (e.keyCode === utilities.keyCodes.ESCAPE) {
            goToIndex(i, a).focus()
          }
        })
      })
    }
  })
}

function keyboardMobileMenu() {
  document.querySelectorAll('.mobile-nav .menu-item > a, .mobile-nav .dropdown, .mobile-nav .menu-search-form input').forEach((el, i, a) => {
    // Prevent keyboard scrolling
    el.addEventListener('keydown', e => {
      if (e.keyCode === utilities.keyCodes.ARROW_UP || e.keyCode === utilities.keyCodes.ARROW_DOWN) {
        e.preventDefault()
      }
    })
  })
}

function getParentNav(a, hover) {
  const parent = a.parentElement.parentElement
  if (parent.classList.contains('sub-menu')) {
    const li = parent.parentElement
    li.classList.add('hover')
    if (hover) {
      li.classList.add('hover')
    }
    else {
      li.classList.remove('hover')
    }
    getParentNav(li.children[0], hover)
  }
}

function updateTabIndex() {
  // Mobile
  document.querySelectorAll('.mobile-nav .menu-item > a, .mobile-nav .dropdown, .mobile-nav .menu-search-form input').forEach(el => {
    el.setAttribute('tabindex', '-1')
  })
  // Desktop
  document.querySelectorAll('.desktop-nav .menu-item > a, .desktop-nav .menu-search-form input').forEach(el => {
    el.setAttribute('tabindex', '0')
  })
}

function openMobileMenu(hamburger) {
  const header = document.querySelector('.mobile-nav')
  hamburger.classList.remove('closed')
  hamburger.classList.add('opened')
  header.classList.remove('closed')
  header.classList.add('opened')
  hamburger.setAttribute('aria-expanded', 'true')
  document.body.classList.add('no-scroll')
  document.querySelectorAll('.mobile-nav .menu > .menu-item > a, .mobile-nav .menu > .menu-item > .dropdown, .mobile-nav .menu > .menu-item > .menu-search-form input').forEach(el => {
    el.setAttribute('tabindex', '0')
  })
  utilities.trapFocus(document.querySelector('.site-header'))
}

function closeMobileMenu(hamburger) {
  const header = document.querySelector('.mobile-nav')
  hamburger.classList.remove('opened')
  hamburger.classList.add('closed')
  header.classList.remove('opened')
  header.classList.add('closed')
  hamburger.setAttribute('aria-expanded', 'false')
  document.body.classList.remove('no-scroll')
  document.querySelectorAll('.mobile-nav .menu-item > a, .mobile-nav .dropdown, .mobile-nav .menu-search-form input').forEach(el => {
    el.setAttribute('tabindex', '-1')
    el.classList.remove('opened')
    if (el.hasAttribute('aria-expanded')) {
      el.setAttribute('aria-expanded', 'false')
    }
  })
  utilities.releaseFocus(document.querySelector('.site-header'))
}

function openMobileDropdown(dropdown) {
  dropdown.classList.remove('closed')
  dropdown.classList.add('opened')
  dropdown.setAttribute('aria-expanded', 'true')
  // Make (only) next level children tabbable
  const menuItems = dropdown.nextElementSibling.children
  for (let i = 0; i < menuItems.length; i++) {
    const children = menuItems[i].children
    for (let j = 0; j < children.length; j++) {
      if (children[j].tagName === 'A' || children[j].tagName === 'BUTTON') {
        children[j].setAttribute('tabindex', '0')
      }
    }
  }
}

function closeMobileDropdown(dropdown) {
  dropdown.classList.remove('opened')
  dropdown.classList.add('closed')
  dropdown.setAttribute('aria-expanded', 'false')
  dropdown.nextElementSibling.querySelectorAll('a').forEach(el => {
    el.setAttribute('tabindex', '-1')
  })
  dropdown.nextElementSibling.querySelectorAll('.dropdown').forEach(el => {
    el.setAttribute('tabindex', '-1')
    closeMobileDropdown(el)
  })
}

function goToIndex(i, a) {
  if (i < 0) {
    return a[a.length - 1]
  }
  else if (i >= a.length) {
    return a[0]
  }
  return a[i]
}

export { init }
