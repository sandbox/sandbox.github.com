---
layout: demo
title: NBA Shot Chart (Vega)
bodyclass: demo
comments: true
---

<div id="shot-chart-player-select"></div>
<div id="shot-chart" style="border: 1px solid #ccc;"></div>
<p></p>

This was inspired by [@savvas_tj](https://twitter.com/savvas_tj)'s
[post](http://savvastjortjoglou.com/nba-shot-sharts.html#Plotting-the-Shot-Chart-Data)
on creating NBA shot charts in python, as well as [Kirk Goldsberry's articles on Grantland](https://grantland.com/the-triangle/golden-state-warriors-illustrated/).
This is an interactive version built with a
[vega](http://vega.github.io/vega/), using data from
[stats.nba.com](http://stats.nba.com), specifically from this
[link](http://stats.nba.com/stats/shotchartdetail?CFID=33&CFPARAMS=2014-15&ContextFilter=&ContextMeasure=FGA&DateFrom=&DateTo=&GameID=&GameSegment=&LastNGames=0&LeagueID=00&Location=&MeasureType=Base&Month=0&OpponentTeamID=0&Outcome=&PaceAdjust=N&PerMode=PerGame&Period=0&PlayerID=201935&PlusMinus=N&Position=&Rank=N&RookieYear=&Season=2014-15&SeasonSegment=&SeasonType=Regular+Season&TeamID=0&VsConference=&VsDivision=&mode=Advanced&showDetails=0&showShots=1&showZones=0)
for James Harden. Points from free throws do not appear included.

You can use the select input in the upper left corner to switch to a
shot chart of Stephen Curry as well. His numbers are ridiculous.

You can select a set of shots directly on the chart or on any of the
histograms. Just click and move the mouse to outline a rectangular box
over the shots. The FG% and Points per Attempt numbers update
automatically based on the selection.

### Implementation Notes

Notably much more performant than a simpler
[React version](/demos/nba-shot-chart) I played with, even when using
Vega's SVG rendering as opposed to canvas. It looks like React having to
update thousands of component's state incurs a lot of overhead.

In terms of vega's canvas vs SVG rendering, canvas may be smoother but
I cannot tell on my machine with a small dataset of this size.  With
SVG, I had some issues getting selections to register and sometimes
the selection box would disappear on updates to other selections. I
think it is due to vega marking the `rect` as dirty when a different
selection filtered out all of the data.

{% include javascript.html js_file="nba-shot-chart-vega" %}
