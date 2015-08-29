---
layout: demo
title: Histogram rendered with React
bodyclass: demo
---

<style>
.bar rect {
  fill: steelblue;
  shape-rendering: crispEdges;
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
<div id="react-histogram" style="border: 1px solid #ccc;"></div>
<script src="/public/js/react-histogram.js" type="text/javascript"></script>
<p></p>

A basic histogram rendered with React using scale and data functions
from d3. The purpose of this example is to get a feel for using React to
manipulate the DOM instead of d3.
[Here](http://bl.ocks.org/mbostock/3048450) is the blocks example from
which this was inspired.
