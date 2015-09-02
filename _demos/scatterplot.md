---
layout: demo
title: Scatterplot
bodyclass: demo
---

<style>
.axis text {
  font-size: 11px;
}

.axis path, .axis line {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}

.dot {
  fill: steelblue;
  stroke: steelblue;
  opacity: 0.6;
}
</style>
<div id="scatterplot" style="border: 1px solid #ccc;"></div>
<p></p>

A simple scatterplot with react and d3 using
[React Tween State](https://github.com/chenglou/react-tween-state) for
animation.

The points should all start from the origin and then transition to the
final positions.

There are 500 points rendered, at which it starts to feel a little
choppy. At 1,000 points choppiness is very noticeable and at 10,000
points it might as well be static.

{% include javascript.html js_file="react-scatterplot" %}
