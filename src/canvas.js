window.addEventListener('resize', resizeCanvas)
resizeCanvas()
function resizeCanvas() {
    const { clientHeight: height, clientWidth: width } = document.documentElement
    const canvas = document.getElementById('canvas')
    canvas.width = width
    canvas.height = height
}