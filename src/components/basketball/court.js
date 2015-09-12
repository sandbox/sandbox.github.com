import { ShotChartInteractionSignals, ShotChartInteractionPredicates, filterExclude } from './interactions'

var ShotChart = {
  "name": "shotChart",
  "type": "group",
  "properties": {
    "update": {
      "x": { "value": 0 },
      "y": { "value": 150 },
      "width": {"value": 450 },
      "height": {"value": 1.1 * 450 }
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
            "test": `${filterExclude()}`
          }
        ]
      },
      "key": "shot_id",
      "properties": {
        "enter": {
          "shape": { "scale": "playerSymbol", "field": "PLAYER_NAME" },
          "x": {"scale": "x", "value": 0},
          "y": {"scale": "y", "value": 0},
          "fill": { "scale": "makeColor", "field": "EVENT_TYPE" },
          "size": { "scale": "width", "value": 70 }
        },
        "update": {
          "x": {"scale": "x", "field": "LOC_X"},
          "y": {"scale": "y", "field": "LOC_Y"},
          "fillOpacity" : {
            "rule": [
              {
                "predicate": {"name": "chartBrush", "x": {"field": "LOC_X"}, "y": {"field": "LOC_Y"}},
                "value": 0.8
              },
              { "value": 0.2 }
            ]
          }
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
    },
    {
      "type": "rect",
      "properties": {
        "enter": {
          "fill": {"value": "grey"},
          "fillOpacity": {"value": 0.2}
        },
        "update": {
          "x": {"scale": "x", "signal": "minchartX"},
          "x2": {"scale": "x", "signal": "maxchartX"},
          "y": {"scale": "y", "signal": "minchartY"},
          "y2": {"scale": "y", "signal": "maxchartY"}
        }
      }
    }
  ]
}

export { ShotChart }
