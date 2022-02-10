
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
const ctx = canvas.getContext('2d')
ctx.strokeStyle = '#333'

// 一次贝塞尔曲线绘制
const drawBezierCurve = () => {
    const { points:  pointsArray } = drawPointObj
    const currList =  pointsArray.slice(0, 3) // 获取计算贝塞尔曲线的三个点,正序
    const [
        startPoint,
        midPoint,
        currentPoint
    ] = currList.reverse()

    const controlPoint = {
        x: (startPoint.x + midPoint.x) / 2,
        y: (startPoint.y + midPoint.y) / 2,
    }
    const endPoint = {
        x: (midPoint.x + currentPoint.x) / 2,
        y: (midPoint.y + currentPoint.y ) / 2,
    }

    ctx.beginPath()
    ctx.moveTo(drawPointObj.begin.x, drawPointObj.begin.y)
    ctx.quadraticCurveTo(controlPoint.x,  controlPoint.y, endPoint.x, endPoint.y)
    ctx.stroke()
    ctx.closePath()
    drawPointObj.pointsArray = currList
    drawPointObj.begin = endPoint
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
        x: (point1.x + point2.x) / 2,
        y: (point1.y + point2.y ) / 2,
    }

    const control_3 = {
        x: (point2.x + point3.x) / 2,
        y: (point2.y + point3.y ) / 2,
    }

    // 二次贝塞尔点位计算
    const controlPoint = {
        x: (drawPointObj.begin.x + control_1.x) / 2,
        y: (drawPointObj.begin.y + control_1.y) / 2,
    }

    const endPoint = {
        x: (control_1.x + control_2.x) / 2,
        y: (control_1.y + control_2.y) / 2,
    }

    ctx.beginPath()
    ctx.moveTo(drawPointObj.begin.x, drawPointObj.begin.y)
    ctx.quadraticCurveTo(controlPoint.x,  controlPoint.y, endPoint.x, endPoint.y)
    ctx.stroke()
    ctx.closePath()
    drawPointObj.pointsArray = currList
    drawPointObj.begin = endPoint
}

// 铅笔绘制
const drawByPencil = (x, y) => {
    const { points:  pointsArray } = drawPointObj
    const {
        xBef,
        yBef,
    } = pointsArray[0]
    if(xBef === x && yBef === y) {
        console.log("点位相同忽略计算")
        return
    }
    pointsArray.unshift({
        x, 
        y
    })
    if (pointsArray?.length >= 4) {
        drawQuadraticBezierCurve()
    }   
}

const addSketchListener = () => {  
    document.addEventListener('mouseup', () => {
        drawPointObj.state = false
        drawPointObj.points = { ...initPoint?.point }
    })

    canvas.addEventListener('mousedown', ({
        clientX:x, clientY:y
    }) => {
        const curr = { x, y }
        drawPointObj.state = true
        drawPointObj.points = [curr]
        drawPointObj.begin = curr
    })
    
    canvas.addEventListener('mousemove', ({
        clientX, clientY
    }) => {
        if(!drawPointObj?.state) return 
        drawByPencil(clientX, clientY)
    })
}

const init = () => {
    addSketchListener()
}

init()
