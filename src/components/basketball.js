import { describeArc } from './arc'
import { ShotChartInteractionSignals, ShotChartInteractionPredicates } from './basketball/interactions'

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
      {/* three point arc */}
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

var ShotChartSpec = {
  "width":  960,
  "height": 800,
  "data": [
    {
      "name": "table",
      "transform": [
        {"type": "formula", "field": "hoopdistance", "expr": "sqrt(pow(datum.LOC_X, 2) + pow(datum.LOC_Y, 2))/10"},
        {"type": "bin", "field": "hoopdistance", "min": 0, "max": 90, "step": 1, "output": { "bin": "bin_hoopdistance" }},
        {"type": "bin", "field": "LOC_X", "min": -260, "max": 260, "step": 5, "output": { "bin": "bin_LOC_X" }},
        {"type": "bin", "field": "LOC_Y", "min": -50,  "max": 470, "step": 5, "output": { "bin": "bin_LOC_Y" }}
      ]
    },
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
    },
    {
      "name": "xdistance",
      "source": "table",
      "transform": [
        {
          "type": "aggregate",
          "groupby" : { "field": "bin_LOC_X" },
          "summarize": {"LOC_X": ["count"]}
        }
      ]
    },
    {
      "name": "ydistance",
      "source": "table",
      "transform": [
        {
          "type": "aggregate",
          "groupby" : { "field": "bin_LOC_Y" },
          "summarize": {"LOC_Y": ["count"]}
        }
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
      "domain": ["Missed Shot", "Made Shot"],
      "range": ["#e6550d", "#31a354"]
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
    {
      "name": "distGroup",
      "type": "group",
      "properties": {
        "update": {
          "x": { "value": 620 },
          "y": { "value": 2.5 },
          "width": {"value": 200 },
          "height": {"value": 100 },
          "fill": {"value": "#fff"}
        }
      },
      "scales": [
        {
          "name": "x",
          "type": "linear",
          "range": "width",
          // "reverse" : true, // hoop on bottom view
          "domain": [0, 50]
        },
        {
          "name": "y",
          "type": "linear",
          "range": "height",
          "domain": { "data": "distance", "field": "count_hoopdistance" },
          "domainMin": 0
        },
      ],
      "axes": [{
        "type": "x", "scale": "x", "tickFormat": "0d"
      }],
      "marks": [
        {
          "type": "rect",
          "from": {
            "data": "table",
            "transform": [
              {
                "type": "aggregate",
                "groupby" : [ "bin_hoopdistance", "EVENT_TYPE" ],
                "summarize": {"*": ["count"]}
              },
              { "type": "stack", "groupby": ["bin_hoopdistance"], "field": "count", "sortby": "EVENT_TYPE" }
            ]
          },
          "properties": {
            "update": {
              "stroke": {"scale": "makeColor", "field": "EVENT_TYPE"},
              "fillOpacity": {
                "rule": [
                  {
                    "predicate": {"name": "distBrush", "x": {"field": "bin_hoopdistance"}},
                    "value": 0.8
                  },
                  {"value": 0.2}
                ]
              },
              "x": {"scale": "x", "field": "bin_hoopdistance"},
              "width": {"scale": "x", "value": 1},
              "y":  {"scale": "y", "field": "layout_start"},
              "y2": {"scale": "y", "field": "layout_end"},
              "fill": {"scale": "makeColor", "field": "EVENT_TYPE"}
            },
            "exit": {
              "x": {"scale": "x", "value": 0},
              "y": {"scale": "y", "value": 0},
              "y2": {"scale": "y", "value": 0}
            }
          }
        },
        {
          "type": "text",
          "properties": {
            "enter": {
              "x": {"value": -10},
              "y": {"value": -10},
              "text": {"value": "Shot Distance from Hoop (in feet)"},
              "fill": {"value": "black"},
              "fontSize": {"value": 14},
              "fontWeight": {"value": "bold"}
            }
          }
        },
        {
          "type": "rect",
          "properties": {
            "enter": {
              "fill": {"value": "grey"},
              "fillOpacity": {"value": 0.2}
            },
            "update": {
              "x": {"scale": "x", "signal": "distStart"},
              "x2": {"scale": "x", "signal": "distEnd"},
              "y": {"value": 0},
              "y2": {"field": {"group": "height"}}
            }
          }
        }
      ]
    },
    {
      "name": "xLocGroup",
      "type": "group",
      "properties": {
        "update": {
          "x": { "value": 0 },
          "y": { "value": 2.5 },
          "width": {"value": 600 },
          "height": {"value": 100 }
        }
      },
      "scales": [
        {
          "name": "x",
          "type": "linear",
          "range": "width",
          // "reverse" : true, // hoop on bottom view
          "domain": [-250, 250]
        },
        {
          "name": "thickness",
          "type": "linear",
          "range": "width",
          "domain": [0, 500]
        },
        {
          "name": "y",
          "type": "linear",
          "range": "height",
          "domain": { "data": "xdistance", "field": "count_LOC_X" }
        },
      ],
      "marks": [
        {
          "type": "rect",
          "from": {
            "data": "table",
            "transform": [
              {
                "type": "filter",
                "test": "(minDist == maxDist || (datum.hoopdistance >= minDist && datum.hoopdistance <= maxDist))"
              },
              {
                "type": "aggregate",
                "groupby" : ["bin_LOC_X", "EVENT_TYPE"],
                "summarize": {"*": ["count"]}
              },
              { "type": "stack", "groupby": ["bin_LOC_X"], "field": "count", "sortby": "EVENT_TYPE"}
            ]
          },
          "properties": {
            "update": {
              "stroke": {"scale": "makeColor", "field": "EVENT_TYPE"},
              "fillOpacity": {"value": 0.8},
              "x": {"scale": "x", "field": "bin_LOC_X"},
              "width": {"scale": "thickness", "value": 5},
              "y": {"scale": "y", "field": "layout_start"},
              "y2": {"scale": "y", "field": "layout_end"},
              "fill": {"scale": "makeColor", "field": "EVENT_TYPE"}
            },
            "exit": {
              "x": {"scale": "x", "value": 0},
              "y": {"scale": "y", "value": 0},
              "y2": {"scale": "y", "value": 0}
            }
          }
        }
      ]
    },
    {
      "name": "yLocGroup",
      "type": "group",
      "properties": {
        "update": {
          "x": { "value": 600 },
          "y": { "value": 100 },
          "width": {"value": 100 },
          "height": {"value": 660 }
        }
      },
      "scales": [
        {
          "name": "thickness",
          "type": "linear",
          "range": "height",
          "reverse": true,
          "domain": [0, 550]
        },
        {
          "name": "x",
          "type": "linear",
          "range": "width",
          "domain": { "data": "ydistance", "field": "count_LOC_Y" }
        },
        {
          "name": "y",
          "type": "linear",
          "range": "height",
          "reverse": true,
          "domain": [-50, 500]
        },
      ],
      "marks": [
        {
          "type": "rect",
          "from": {
            "data": "table",
            "transform": [
              {
                "type": "filter",
                "test": "(minDist == maxDist || (datum.hoopdistance >= minDist && datum.hoopdistance <= maxDist))"
              },
              {
                "type": "aggregate",
                "groupby" : ["bin_LOC_Y", "EVENT_TYPE"],
                "summarize": {"*": ["count"]}
              },
              { "type": "stack", "groupby": ["bin_LOC_Y"], "field": "count", "sortby": "EVENT_TYPE"}
            ]
          },
          "properties": {
            "update": {
              "stroke": {"scale": "makeColor", "field": "EVENT_TYPE"},
              "fillOpacity": {"value": 0.8},
              "y": {"scale": "y", "field": "bin_LOC_Y"},
              "x": {"scale": "x", "field": "layout_start"},
              "x2": {"scale": "x", "field": "layout_end"},
              "height": {"scale": "thickness", "value": 5},
              "fill": {"scale": "makeColor", "field": "EVENT_TYPE"}
            },
            "exit": {
              "x": {"scale": "x", "value": 0},
              "y": {"scale": "y", "value": 0},
              "y2": {"scale": "y", "value": 0}
            }
          }
        }
      ]
    },
    {
      "type": "group",
      "properties": {
        "update": {
          "x": { "value": 0 },
          "y": { "value": 100 },
          "width": {"value": 600 },
          "height": {"value": 1.1 * 600 }
        }
      },
      "scales": [
        {
          "name": "width",
          "type": "linear",
          "range": "width",
          "domain": [0, 500]
        },
        {
          "name": "height",
          "type": "linear",
          "range": "height",
          "domain": [0, 550]
        },
        {
          "name": "x",
          "type": "linear",
          "range": "width",
          // "reverse" : true, // hoop on bottom view
          "domain": [-250, 250]
        },
        {
          "name": "y",
          "type": "linear",
          "range": "height",
          "reverse": true, // hoop on top view
          "domain": [-50, 500]
        },
      ],
      "marks": [
        {
          "type": "symbol",
          "from": {
            "data": "table",
            "transform": [
              {
                "type": "filter",
                "test": "(minDist == maxDist || (datum.hoopdistance >= minDist && datum.hoopdistance <= maxDist))"
              },
            ]
          },
          "key": "shot_id",
          "properties": {
            "enter": {
              "shape": { "scale": "playerSymbol", "field": "PLAYER_NAME" },
              "x": {"scale": "x", "value": 0},
              "y": {"scale": "y", "value": 0},
              "fillOpacity" : { "scale": "makeOpacity", "field": "SHOT_MADE_FLAG" },
              "fill": { "scale": "makeColor", "field": "EVENT_TYPE" },
              "size": { "scale": "width", "value": 70 }
            },
            "update": {
              "x": {"scale": "x", "field": "LOC_X"},
              "y": {"scale": "y", "field": "LOC_Y"}
            },
            "exit": {
              "x": {"scale": "x", "value": 0},
              "y": {"scale": "y", "value": 0}
            }
          }
        },
        {
          "type": "arc",
          "from": {"data": "arcs"},
          "properties": {
            "enter": {
              "stroke": {"value": "#000000"},
              "strokeDash": {"field": "strokeDash"},
              "x": {"scale": "x", "field": "x"},
              "y": {"scale": "y", "field": "y"},
              "outerRadius": {"scale": "width", "field": "radius"},
              "innerRadius": {"scale": "width", "field": "radius"},
              "startAngle": {"scale": "degreeRadians", "field": "startAngle"},
              "endAngle": {"scale": "degreeRadians", "field": "endAngle"}
            }
          }
        },
        {
          "type": "rect",
          "from": {"data": "courtLines"},
          "properties": {
            "enter": {
              "fill": {"value": null},
              "stroke": {"value": "#000000"},
              "strokeWidth": {"value": 1},
              "x": {"scale": "x", "field": "x"},
              "y": {"scale": "y", "field": "y"},
              "x2": {"scale": "x", "field": "x2"},
              "y2": {"scale": "y", "field": "y2"}
            }
          }
        }
      ]
    }
  ]
}

export {CourtBounds, BasketBall, ShotChartSpec}
