function preventClickjacking() {
  if (window.self === window.top) {
    const antiClickjack = document.getElementById('antiClickjack')
    antiClickjack.parentNode.removeChild(antiClickjack)
  } else {
    window.top.location = window.self.location
  }
}

window.addEventListener('DOMContentLoaded', preventClickjacking)
window.addEventListener('load', preventClickjacking)
window.addEventListener('resize', preventClickjacking)
