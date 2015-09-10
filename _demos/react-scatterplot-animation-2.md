---
layout: demo
title: React Scatterplot Animation II
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

This is a second version of [this](/demos/scatterplot), to test a if
grouping tween transitions into a single component is more performant
than using tween state on each individual point. It is not and appears
to take too much time updating all state at once to have any animation
at all (no requestAnimationFrame calls get made).

{% include javascript.html js_file="react-scatterplot-2" %}
