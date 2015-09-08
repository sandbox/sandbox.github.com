---
layout: demo
title: Interactive NBA Shot Chart (Vega)
bodyclass: demo
comments: true
---

Touch or click to outline a rectangular box over the shots or any of
the histograms. The FG% and Points per Attempt numbers update
automatically. Select from available shot charts in the upper left corner.

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

Steph's numbers are ridiculous.

{% include javascript.html js_file="nba-shot-chart-vega" %}
