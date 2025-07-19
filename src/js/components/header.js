import { getHeaderHeight } from '../functions/header-height.js'
import { throttle } from '../functions/throttle.js'

let { element: header, height: headerHeight } = getHeaderHeight()

function handleScroll() {
  if (!header) return
  if (window.scrollY >= (headerHeight * .5)) {
    header.classList.add('bg-body', 'shadow')
  } else {
    header.classList.remove('bg-body', 'shadow')
  }
}

window.addEventListener('resize', throttle(() => {
  const result = getHeaderHeight()
  header = result.element
  headerHeight = result.height
  handleScroll()
}, 200))
window.addEventListener('scroll', handleScroll)

handleScroll()
