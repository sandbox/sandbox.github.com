---
layout: demo
title: Histogram animation with React
bodyclass: demo
---

<style>
.bar rect {
  fill: steelblue;
  shape-rendering: crispEdges;
}

.bar.barheight-enter rect {
  height: 0;
}

.bar.barheight-enter.barheight-enter-active rect {
  transition: height .5s ease-in;
}

.bar text {
  fill: #fff;
  font-size: 11px;
}

.axis text {
  font-size: 11px;
}

.axis path, .axis line {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}
</style>
<div id="react-transition" style="border: 1px solid #ccc;"></div>
<p></p>

Using React addons transition groups to get a feel for animating
elements with react. This animates the histogram bars height starting
from 0 height.

<script src="/public/js/react-histogram-transition.js" type="text/javascript"></script>
