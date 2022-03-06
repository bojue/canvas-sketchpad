
/**
 * state: 判断是否可绘制状态
 * begin: 开始绘制节点位置信息
 * point: 记录鼠标位置，用于绘制节点起始点
 */
const initPoint = {
    state: false, 
    begin: {
        x: null,
        y: null,
    },
    point: []
}

const drawPointObj = {
    ...initPoint
}

const canvas = document.querySelector('#canvas')
const dpr = window.devicePixelRatio || window.webkitDevicePixelRatio || window.mozDevicePixelRatio || 1 // 物理像素比，0.5px模糊问题
const ctx = canvas.getContext('2d')

const settingCanvas = () => {
    const { clientHeight: height, clientWidth: width } = document.documentElement
    const canvas = document.getElementById('canvas')
    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height* dpr)
    // 设置宽高
    canvas.style.width =  `${width}px`
    canvas.style.height =  `${height}px`
    ctx.scale(dpr, dpr)
    ctx.lineWidth = 2
    ctx.strokeStyle = '#000'
    ctx.lineJoin = 'round'
}

// 二次贝塞尔曲线绘制
const drawQuadraticBezierCurve = () => {
    const { points:  pointsArray } = drawPointObj
    const currList =  pointsArray.slice(0, 4) // 获取计算贝塞尔曲线的三个点,正序
    const [
        point0,
        point1,
        point2,
        point3,
    ] = currList.reverse()

    // 一次贝塞尔点位计算
    const control_1 = {
        x: (point0.x + point1.x) / 2,
        y: (point0.y + point1.y) / 2,
    }
    const control_2 = {
        x: (control_1.x + point2.x) / 2,
        y: (control_1.y + point2.y ) / 2,
    }

    const control_3 = {
        x: (control_2.x + point3.x) / 2,
        y: (control_2.y + point3.y ) / 2,
    }

    // 二次贝塞尔点位计算
    const controlPoint = {
        x: (drawPointObj.begin.x + control_1.x) / 2,
        y: (drawPointObj.begin.y + control_1.y) / 2,
    }

    const endPoint = {
        x: (controlPoint.x + control_2.x) / 2,
        y: (controlPoint.y + control_2.y) / 2,
    }

    ctx.beginPath()
    ctx.moveTo(drawPointObj.begin.x, drawPointObj.begin.y)
    ctx.quadraticCurveTo(controlPoint.x,  controlPoint.y, endPoint.x, endPoint.y)
    ctx.stroke()
    ctx.closePath()
    drawPointObj.pointsArray = currList
    drawPointObj.begin = endPoint
}

// 开始绘制
const drawStart = (x, y) => {
    const curr = { x, y }
    drawPointObj.state = true
    drawPointObj.points = [curr]
    drawPointObj.begin = curr
    // 更换光标
    canvas.style.cursor = 'url(./static/pen.svg) 10 24,pointer'
}

// 绘制
const draw = _.throttle((x, y) => {
    if(!drawPointObj?.state) return 
    const { points:  pointsArray } = drawPointObj
    pointsArray.unshift({
        x, 
        y
    })
    if (pointsArray?.length >= 4) {
        drawQuadraticBezierCurve()
    }   
}, 18)

const addSketchListener = () => {  
    document.addEventListener('mouseup', () => {
        drawPointObj.state = false
        drawPointObj.points = { ...initPoint?.point }
        canvas.style.cursor = 'pointer' 
    })
    window.addEventListener('resize', settingCanvas)

    const isMobile = /(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)

    if(isMobile) {
        canvas.addEventListener('touchstart', ({
            clientX:x, clientY:y
        }) => drawStart(x, y))
        canvas.addEventListener('touchmove',({
            clientX:x, clientY:y
        }) => draw(x, y) )
    } else {
        canvas.addEventListener('mousedown', ({
            clientX:x, clientY:y
        }) => drawStart(x, y))
        canvas.addEventListener('mousemove', ({
            clientX:x, clientY:y
        }) => draw(x, y) )
    }

}

const init = () => {
    addSketchListener()
    settingCanvas()
}

init()
