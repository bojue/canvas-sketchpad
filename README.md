# canvas-sketchpad

基于二次贝塞尔曲线，处理鼠标绘制canvas存在的严重锯齿问题

[在线预览](https://bojue.github.io/canvas-sketchpad/)

画笔优化方案：

1. 二次贝塞尔曲线优化
2. 节流
3. devicePixelRatio(物理像素比) > 1时，处理画笔0.5模糊问题
