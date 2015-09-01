---
layout: demo
title: NBA Shot Chart - James Harden
bodyclass: demo
---

<div id="shot-chart" style="border: 1px solid #ccc;"></div>
<p></p>

This was inspired by [@savvas_tj](https://twitter.com/savvas_tj)'s
[post](http://savvastjortjoglou.com/nba-shot-sharts.html#Plotting-the-Shot-Chart-Data)
on creating NBA shot charts in python.  This is built with a
combination of d3 and React for fun, using data from
[stats.nba.com](http://stats.nba.com), specifically from the url:

```
  http://stats.nba.com/stats/shotchartdetail?
  CFID=33
  &
  CFPARAMS=2014-15
  &
  ContextFilter=
  &
  ContextMeasure=FGA
  &
  DateFrom=
  &
  DateTo=
  &
  GameID=
  &
  GameSegment=
  &
  LastNGames=0
  &
  LeagueID=00
  &
  Location=
  &
  MeasureType=Base
  &
  Month=0
  &
  OpponentTeamID=0
  &
  Outcome=
  &
  PaceAdjust=N
  &
  PerMode=PerGame
  &
  Period=0
  &
  PlayerID=201935
  &
  PlusMinus=N
  &
  Position=
  &
  Rank=N
  &
  RookieYear=
  &
  Season=2014-15
  &
  SeasonSegment=
  &
  SeasonType=Regular+Season
  &
  TeamID=0
  &
  VsConference=
  &
  VsDivision=
  &
  mode=Advanced
  &
  showDetails=0
  &
  showShots=1
  &
  showZones=0
```

<script src="/public/js/nba-shot-chart.js" type="text/javascript"></script>
