---
layout: post
title: Making an interactive NBA shot chart with Vega
comments: true
---

[Here's the full interactive demo](/demos/nba-shot-chart-vega), the following is just an image!

[![James Harden Shots in the Free Throw area](/public/images/shot-chart-harden-screen-shot.png)](/demos/nba-shot-chart-vega)

#### Motivation

Inspired by [@savvas_tj](https://twitter.com/savvas_tj)'s
[post](http://savvastjortjoglou.com/nba-shot-sharts.html#Plotting-the-Shot-Chart-Data)
on creating NBA shot charts in python, as well as
[Kirk Goldsberry's articles on Grantland](https://grantland.com/the-triangle/golden-state-warriors-illustrated/),
I wanted to prototype an interactive shot chart using [vega](http://vega.github.io/vega/).

I used vega, because I hadn't really used it much
before and the grammar of graphics model for producing visualizations
is super cool and powerful. Also, a recent release of vega added a
system for [declarative interaction design](https://idl.cs.washington.edu/papers/reactive-vega/),
which sounded particularly fun.

#### The Data

[savvas_tj](http://savvastjortjoglou.com/nba-shot-sharts.html#Getting-the-data)
does a great job detailing the data format, so I'll just explain what
I did with vega to work with the data.

Particularly, I needed to add data for distance from hoop, points
scored, the bins to be used in the histograms, brushed field goal
percentage, and brushed points per attempt.

The first transformation was to add new columns to the original data, `POINTS`, `MADE_POINTS`, `hoopdistance`, and bins:
{% highlight javascript %}
{
  "name": "table",
  "transform": [
    {"type": "formula", "field": "POINTS", "expr": "parseInt(datum.SHOT_TYPE)"},
    {"type": "formula", "field": "MADE_POINTS", "expr": "datum.POINTS * datum.SHOT_MADE_FLAG"},
    {"type": "formula", "field": "hoopdistance", "expr": "sqrt(pow(datum.LOC_X, 2) + pow(datum.LOC_Y, 2))/10"},
    {"type": "bin", "field": "hoopdistance", "min": 0, "max": 90, "step": 1, "output": { "bin": "bin_hoopdistance" }},
    {"type": "bin", "field": "LOC_X", "min": -260, "max": 260, "step": 5, "output": { "bin": "bin_LOC_X" }},
    {"type": "bin", "field": "LOC_Y", "min": -50,  "max": 470, "step": 5, "output": { "bin": "bin_LOC_Y" }}
  ]
}
{% endhighlight %}

Then I created a new data source that made aggregates for the histograms like:

{% highlight javascript %}
{
  "name": "distance",
  "source": "table",
  "transform": [
    {
      "type": "aggregate",
      "groupby" : { "field": "bin_hoopdistance" },
      "summarize": {"hoopdistance": ["count"]}
    }
  ]
}
{% endhighlight %}

Lastly calculating the field goal percentage and points per attempt:

{% highlight javascript %}
{
  "name": "percentages",
  "source": "table",
  "transform": [
    {
      "type": "filter",
      "test":  `${ShotChartInteractionFilters.distance} && ${ShotChartInteractionFilters.LOC_X} && ${ShotChartInteractionFilters.LOC_Y} && ${ShotChartInteractionFilters.brush}`
    },
    {
      "type": "aggregate",
      "summarize": {"*": ["count"], "MADE_POINTS": ["sum"], "SHOT_MADE_FLAG": ["sum"]}
    },
    {
      "type": "formula",
      "field": "FGP",
      "expr": "datum.sum_SHOT_MADE_FLAG / datum.count"
    },
    {
      "type": "formula",
      "field": "PPA",
      "expr": "datum.sum_MADE_POINTS / datum.count"
    }
  ]
}
{% endhighlight %}

Adding these to the data declaration portion of the vega spec, will
now provide data to our visual components that looks like:

{% highlight reStructuredText %}
// Added columns to the original table
+-----------------------------------------------------------------+
| POINTS | MADE_POINTS | bin_hoopdistance | bin_LOC_X | bin_LOC_Y |
+--------+-------------+------------------+-----------+-----------+
| 2      | 0           | 10               | 60        | 80        |
| 3      | 3           | 25               | 15        | 20        |
| 2      | 2           | 20               | 16        | 12        |
| ...                                                             |
+-----------------------------------------------------------------+


// New table: 'distance' from aggregating the original table
+---------------------------------------+
| bin_hoopdistance | count_hoopdistance |
+------------------+--------------------+
| 0                | 30                 |
| 1                | 60                 |
| 2                | 80                 |
| ....                                  |
+---------------------------------------+

// New table: 'percentages' from filtering and aggregating the original table
+-------------------------------------------------------------+
| count | sum_MADE_POINTS | sum_SHOT_MADE_FLAG | FGP  | PPA   |
+-------+-----------------+--------------------+------+-------+
| 23455 | 30202           | 12000              | .511 | 1.287 |
+-------------------------------------------------------------+
{% endhighlight %}

#### The Visual Components

The visual components for the shot chart break down in to the
following sections:

* The court lines
* The shot scatterplot
* The distance and location histograms
* The field goal percentage and points per attempt indicators

In particular, the shot scatterplot is made by stating each shot
should be drawn as a circle that is positioned based on the `LOC_X`
and `LOC_Y` table fields. This is done in vega like:

{% highlight javascript %}
{
  "type": "symbol",
  "from": {
    "data": "table"
  },
  "key": "shot_id",
  "properties": {
    "update": {
      "shape": { "value": "circle" },
      "x": {"scale": "x", "field": "LOC_X"},
      "y": {"scale": "y", "field": "LOC_Y"},
      "fillOpacity" : { "value": 0.5 }
    }
  }
}
{% endhighlight %}

Each component has statements that map data to a visual mark and base
visual properties (e.g. position, size, color, shape) on the data.

#### Adding Interactions

In vega, interactions are specified as `signals` that listen to events
like `mousedown`, `mouseup`. From these events we extract information
like mouse position and then lift that data from the visual space to
the data space.

So to add the brush+linking interaction to each histogram component,
we first define signals like:

{% highlight javascript %}
[
    {
      "name": "distStart",
      "init": -1,
      "streams": [{
        "type": "@distGroup:mousedown",
        "expr": "eventX(scope)",
        "scale": {"scope": "scope", "name": "x", "invert": true}
      }]
    },
    {
      "name": "distEnd",
      "init": -1,
      "streams": [{
        "type": "@distGroup:mousedown, [@distGroup:mousedown, window:mouseup] > window:mousemove",
        "expr": "clamp(eventX(scope), 0, scope.width)",
        "scale": {"scope": "scope", "name": "x", "invert": true}
      }]
    },
    {"name": "minDist", "expr": "max(min(distStart, distEnd), 0)"},
    {"name": "maxDist", "expr": "min(max(distStart, distEnd), 50)"}
]
{% endhighlight %}

This defines 4 signals to be used as data in the visual components.
For example, the signal called `distStart`, listens to a stream of
`mousedown` events on the `distGroup` visual component.  From the
events it calculates the horizontal position with an expression
`eventX(scope)`. This horizontal position is then mapped to a data
value by inverting the scale that positions a data value to a
horizontal position.

Now we can use `distStart` as a value in formulas, because it has a
value in the data space lifted from the visual space.  For example,
the signals from above are used in a filter like:

{% highlight javascript %}
{
  "type": "filter",
  "test": "(minDist == maxDist || (datum.hoopdistance >= minDist && datum.hoopdistance <= maxDist))"
}
{% endhighlight %}

The shot scatterplot signal is similar, except it listens on events in
both the horizontal and vertical direction.

#### Things to add?

* Add components for other data like "Time left in game", "Time left on shot clock", "Distance of Closest Defender"
* Segment the court into defined regions like "Left corner 3", "Right Corner 3", "Restricted Area"
* Toggleable hex bin layer to calculate aggregates over the entire court, a la [Kirk Goldsberry](https://grantland.com/the-triangle/golden-state-warriors-illustrated/)
* Add filters for the opponent team
* Work with all data from all players from a season
  * Add filters for players
  * Calculate league averages based on court section, and compare any
    chosen players based on difference from league average

#### Thoughts

Working with vega was pretty fun, and I think overall made the process
for building this prototype probably quicker than it would have been
otherwise.

Last thoughts on using vega:

* It is very verbose, and a composable module for common interactions
  or visual components would be extremely helpful.

* Declaring the view components and interactions was easy, but
  debugging them was hard. There is very little visibility in to
  what's going, but if you can trust the system, it works well.

* Remember to put the appropriate values in the `enter`, `update`,
  `exit` properties on the marks. A couple of times I got stuck on why
  things weren't updating on filter changes, but then realized it was
  because the property was calculated on `enter` instead of on
  `update`.

* How to draw an individual line segment from a data point instead of
  one path connecting each data point with a line segment

* How to draw ellipses for the court arcs, this caused the chart to
  need a specific width/height ratio otherwise the arcs get deformed
  if the court space gets stretch or contracted

* It is great as a tool for building a tool to visualize data or
  prototyping what's needed in a larger system.
