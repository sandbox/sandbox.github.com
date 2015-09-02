---
layout: demo
title: NBA Shot Chart (Vega) - James Harden
bodyclass: demo
---

<div id="shot-chart" style="border: 1px solid #ccc;"></div>
<p></p>

This was inspired by [@savvas_tj](https://twitter.com/savvas_tj)'s
[post](http://savvastjortjoglou.com/nba-shot-sharts.html#Plotting-the-Shot-Chart-Data)
on creating NBA shot charts in python.  This is built with a
[vega](http://vega.github.io/vega/), using data from
[stats.nba.com](http://stats.nba.com), specifically from this [link](http://stats.nba.com/stats/shotchartdetail?CFID=33&CFPARAMS=2014-15&ContextFilter=&ContextMeasure=FGA&DateFrom=&DateTo=&GameID=&GameSegment=&LastNGames=0&LeagueID=00&Location=&MeasureType=Base&Month=0&OpponentTeamID=0&Outcome=&PaceAdjust=N&PerMode=PerGame&Period=0&PlayerID=201935&PlusMinus=N&Position=&Rank=N&RookieYear=&Season=2014-15&SeasonSegment=&SeasonType=Regular+Season&TeamID=0&VsConference=&VsDivision=&mode=Advanced&showDetails=0&showShots=1&showZones=0).

Notably much more performant than the
[React version](/demos/nba-shot-chart) I played with, even when using
Vega's SVG rendering as opposed to canvas. It looks like having to
update thousands of component's state incurs a lot of overhead.

In terms of Vega's canvas vs SVG rendering, canvas may be smoother but
I cannot tell on my machine with a small dataset of this size.

<script src="/public/js/nba-shot-chart-vega.js" type="text/javascript"></script>
