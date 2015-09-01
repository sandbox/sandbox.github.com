function polarToCartesian(centerX, centerY, radiusX, radiusY, angleInDegrees) {
  var angleInRadians = angleInDegrees * Math.PI / 180.0

  return {
    x: centerX + (radiusX * Math.cos(angleInRadians)),
    y: centerY + (radiusY * Math.sin(angleInRadians))
  }
}

function describeArc(x, y, radiusX, radiusY, startAngle, endAngle){
  var start = polarToCartesian(x, y, radiusX, radiusY, endAngle)
  var end = polarToCartesian(x, y, radiusX, radiusY, startAngle)
  var arcSweep = endAngle - startAngle <= 180 ? "0" : "1"
  return [
    "M", start.x, start.y,
    "A", radiusX, radiusY, 0, arcSweep, 0, end.x, end.y
  ].join(" ")
}

export { describeArc }
