import React from 'react'
import { describeArc } from './arc'
import { ShotChartInteractionSignals, ShotChartInteractionPredicates, ShotChartInteractionFilters, filterExclude } from './basketball/interactions'
import { ShotAggregates } from './basketball/aggregates'
import { ShotChart } from './basketball/court'
import { fieldHistogram, CourtXHistogram, CourtYHistogram } from './basketball/histograms'

class CourtBounds extends React.Component {
  render() {
    let [hoopcenterx, hoopcentery] = [this.props.xscale(0), this.props.yscale(0)]
    let xstart = this.props.xscale(250)
    let xend = this.props.xscale(-250)
    let ystart = this.props.yscale(422.5)
    let yend = this.props.yscale(-47.5)
    let courtheight = yend - ystart
    let courtwidth = Math.abs(xend - xstart)
    let threeradiusx = Math.abs(this.props.xscale(237.5) - hoopcenterx)
    let threeradiusy = hoopcentery - this.props.yscale(237.5)
    let threearc = describeArc(hoopcenterx, hoopcentery, threeradiusx, threeradiusy, -158, -22)
    let centerarc = describeArc(hoopcenterx, ystart, Math.abs(this.props.xscale(60) - hoopcenterx), hoopcentery - this.props.yscale(60), 0, 180)
    let innercenterarc = describeArc(hoopcenterx, ystart, Math.abs(this.props.xscale(20) - hoopcenterx), hoopcentery - this.props.yscale(20), 0, 180)
    let freethrowwidth = Math.abs(this.props.xscale(160) - this.props.xscale(0))
    let freethrowheight = Math.abs(this.props.yscale(-47.5 + 190) - yend)
    let freethrowarcR = Math.abs(this.props.xscale(60) - hoopcenterx)
    let freethrowinnerarc = describeArc(hoopcenterx, this.props.yscale(-47.5 + 190), freethrowarcR, hoopcentery - this.props.yscale(60), 0, 180)
    let freethrowouterarc = describeArc(hoopcenterx, this.props.yscale(-47.5 + 190), freethrowarcR, hoopcentery - this.props.yscale(60), -180, 0)
    let restrictedArc = describeArc(hoopcenterx, hoopcentery, Math.abs(this.props.xscale(40) - hoopcenterx), hoopcentery - this.props.yscale(40), -180, 0)

    return <g>
      {/* hoop */}
      <ellipse stroke="#000" fill="none" cx={this.props.xscale(0)} cy={this.props.yscale(0)} rx={Math.abs(this.props.xscale(7.5) - this.props.xscale(0))} ry={this.props.yscale(0) - this.props.yscale(7.5)} />
      <line strokeWidth={2} stroke="#000" x1={this.props.xscale(-30)} x2={this.props.xscale(30)} y1={this.props.yscale(-7.5)} y2={this.props.yscale(-7.5)}/>
      {/* court boundary */}
      <rect fill="none" stroke="#000" x={xstart} y={ystart} width={courtwidth} height={courtheight} />
      {/* center arc */}
      <path d={centerarc} fill="none" stroke="#000" />
      <path d={innercenterarc} fill="none" stroke="#000" />
      {/* free throw area */}
      <rect fill="none" stroke="#000" x={this.props.xscale(80)} y={this.props.yscale(-47.5 + 190)} width={freethrowwidth} height={freethrowheight} />
      <rect fill="none" stroke="#000" x={this.props.xscale(60)} y={this.props.yscale(-47.5 + 190)} width={Math.abs(this.props.xscale(120) - this.props.xscale(0))} height={freethrowheight} />
      <path d={freethrowouterarc} fill="none" stroke="#000" />
      <path d={freethrowinnerarc} fill="none" stroke="#000" strokeDasharray="5,5"/>
      {/* restricted area arc */}
      <path d={restrictedArc} fill="none" stroke="#000"/>
      <path d={threearc} fill="none" stroke="#000" />
      <line stroke="#000" x1={this.props.xscale(-220)} y1={yend} x2={this.props.xscale(-220)} y2={this.props.yscale(90)} />
      <line stroke="#000" x1={this.props.xscale(220)}  y1={yend} x2={this.props.xscale(220)}  y2={this.props.yscale(90)} />
      </g>
  }
}

class BasketBall extends React.Component {
  render() {
    return <ellipse {...this.props}></ellipse>
  }
}

function aggregateCountData(name, field) {
  return {
    "name": name,
    "source": "table",
    "transform": [
      {
        "type": "aggregate",
        "groupby" : { "field": `bin_${field}` },
        "summarize": {[field]: ["count"]}
      }
    ]
  }
}

var ShotChartSpec = {
  "width":  960,
  "height": 800,
  "data": [
    {
      "name": "table",
      "transform": [
        {"type": "formula", "field": "POINTS", "expr": "parseInt(datum.SHOT_TYPE)"},
        {"type": "formula", "field": "MADE_POINTS", "expr": "datum.POINTS * datum.SHOT_MADE_FLAG"},
        {"type": "formula", "field": "hoopdistance", "expr": "datum.SHOT_DISTANCE"},
        {"type": "formula", "field": "timepassed", "expr": "(datum.PERIOD * 12 * 60 - (datum.MINUTES_REMAINING * 60 + datum.SECONDS_REMAINING))/60"},
        {"type": "bin", "field": "hoopdistance", "min": 0, "max": 90, "step": 1, "output": { "bin": "bin_hoopdistance" }},
        {"type": "bin", "field": "timepassed", "min": 0, "max": 64, "step": 1, "output": { "bin": "bin_timepassed" }},
        {"type": "bin", "field": "LOC_X", "min": -260, "max": 260, "step": 5, "output": { "bin": "bin_LOC_X" }},
        {"type": "bin", "field": "LOC_Y", "min": -50,  "max": 470, "step": 5, "output": { "bin": "bin_LOC_Y" }}
      ]
    },
    aggregateCountData('distance', 'hoopdistance'),
    aggregateCountData('time', 'timepassed'),
    aggregateCountData('xdistance', 'LOC_X'),
    aggregateCountData('ydistance', 'LOC_Y'),
    {
      "name": "percentages",
      "source": "table",
      "transform": [
        {
          "type": "filter",
          "test": `${filterExclude()} && ${ShotChartInteractionFilters.brush}`
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
    },
    {
      "name": "rects",
      "values": [
        {"index": 0, "text": "Shot Attempts", "x": 0, "width": 0, "height": 0, "average": 0.5},
        {"index": 0, "text": "Points Scored", "x": 125, "width": 0, "height": 0, "average": 0.5},
        {"index": 0, "text": "FG%", "x": 250, "width": 100, "height": 10, "average": 92279 / 205550},
        {"index": 0, "text": "Points per Attempt", "x": 375, "width": 100, "height": 10, "average": 203841 / 205550 / 3}
      ]
    },
    { "name": "arcs",
      "values": [
        // center court arc
        { "x": 0           , "y": -47.5 + 470 , "radius": 60    , "startAngle": 90  , "endAngle": 270                          } ,
        { "x": 0           , "y": -47.5 + 470 , "radius": 20    , "startAngle": 90  , "endAngle": 270                          } ,
        // restricted area
        { "x": 0           , "y": 0           , "radius": 40    , "startAngle": -90 , "endAngle": 90                           } ,
        // three point
        { "x": 0           , "y": 0           , "radius": 237.5 , "startAngle": -68 , "endAngle": 68                           } ,
        { "x": 0           , "y": 0           , "radius": 7.5   , "startAngle": 0   , "endAngle": 360                          } ,
        // free throw arc
        { "x": 0           , "y": 142.5       , "radius": 60    , "startAngle": -90 , "endAngle": 90                           } ,
        { "x": 0           , "y": 142.5       , "radius": 60    , "startAngle": -90 , "endAngle": -270, "strokeDash": [5 , 14] }
      ]},
    { "name": "courtLines",
      "values": [
        { "x": -250, "x2": -250 + 500, "y": -47.5, "y2": -47.5 + 470},
        { "x": 30, "y": -7.5, "x2": -30, "y2": -8.5 },
        { "x": 60, "y": 150-7.5, "x2": -60, "y2": -47.5 },
        { "x": 80, "y": 150-7.5, "x2": -80, "y2": -47.5 },
        { "x": -220, "y": 90, "x2": -220.2, "y2": -47.5 },
        { "x": 220.2, "y": 90, "x2": 220, "y2": -47.5 }
      ]},
  ],
  "signals": ShotChartInteractionSignals,
  "predicates": ShotChartInteractionPredicates,

  "scales": [
    {
      "name": "degreeRadians",
      "type": "linear",
      "domain": [0, 360],
      // "range" : [0, 2 * Math.PI]
      "range" : [Math.PI , 3 * Math.PI]
    },
    {
      "name": "makeOpacity",
      "type": "linear",
      "domain": [0, 1],
      "range": [0.4, 0.8]
    },
    {
      "name": "makeColor",
      "type": "ordinal",
      "domain": { "data": "table", "field": "EVENT_TYPE" },
      "range": ["#EA4929", "#31a354"]
    },
    {
      "name": "playerSymbol",
      "type": "ordinal",
      "domain": { "data": "table", "field": "PLAYER_NAME" },
      "range": ["circle", "square", "cross", "diamond", "triangle-up", "triangle-down"]
    }
  ],
  "legends": [
    {
      "orient": "left",
      "fill": "makeColor"
    }
  ],
  "marks": [
    ShotAggregates,
    fieldHistogram('distance',
                   `${filterExclude('hoopdistance')} && ${ShotChartInteractionFilters.brush}`,
                   'dist', 'hoopdistance', [0, 50], 2.5, "Shot Distance from Hoop (in feet)"),
    fieldHistogram('time',
                   `${filterExclude('timepassed')} && ${ShotChartInteractionFilters.brush}`,
                   'timepassed', 'timepassed', [0, 64], 162.5, "Game Time (in minutes from start)"),
    CourtXHistogram,
    CourtYHistogram,
    ShotChart
  ]
}

export {CourtBounds, BasketBall, ShotChartSpec}
