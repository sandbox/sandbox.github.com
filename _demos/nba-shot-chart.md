---
layout: demo
title: NBA Shot Chart (React) - James Harden
bodyclass: demo
custom_css:
  - demo
---

<style>
.dot {
  fill: #EA4929;
  stroke: #EA4929;
  opacity: 0.4;
}
.dot.made {
  fill: #9FBC91;
  stroke: #9FBC91;
  opacity: 0.8;
}
</style>

<div id="shot-chart" style="border: 1px solid #ccc;"></div>
<p></p>

This was inspired by [@savvas_tj](https://twitter.com/savvas_tj)'s
[post](http://savvastjortjoglou.com/nba-shot-sharts.html#Plotting-the-Shot-Chart-Data)
on creating NBA shot charts in python.  This is built with a
combination of d3 and React for fun, using data from
[stats.nba.com](http://stats.nba.com), specifically from this [link](http://stats.nba.com/stats/shotchartdetail?CFID=33&CFPARAMS=2014-15&ContextFilter=&ContextMeasure=FGA&DateFrom=&DateTo=&GameID=&GameSegment=&LastNGames=0&LeagueID=00&Location=&MeasureType=Base&Month=0&OpponentTeamID=0&Outcome=&PaceAdjust=N&PerMode=PerGame&Period=0&PlayerID=201935&PlusMinus=N&Position=&Rank=N&RookieYear=&Season=2014-15&SeasonSegment=&SeasonType=Regular+Season&TeamID=0&VsConference=&VsDivision=&mode=Advanced&showDetails=0&showShots=1&showZones=0).

{% include javascript.html js_file="nba-shot-chart" %}
