function preventClickjacking() {
    if (window.top !== window.self) {
        window.top.location = window.self.location;
    }
}

window.addEventListener('DOMContentLoaded', preventClickjacking);
window.addEventListener('load', preventClickjacking);
window.addEventListener('resize', preventClickjacking);
