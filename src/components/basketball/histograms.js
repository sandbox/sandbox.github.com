import { ShotChartInteractionSignals, ShotChartInteractionPredicates, ShotChartInteractionFilters, shotFilter } from './interactions'

var DistanceHistogram = {
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
            "type": "filter",
            "test": `${shotFilter(['LOC_X', 'xLoc'], ['LOC_Y', 'yLoc'])} && ${ShotChartInteractionFilters.brush}`
          },
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
          "y": {"scale": "y", "value": 0},
          "y2": {"scale": "y", "value": 0}
        }
      }
    },
    {
      "type": "text",
      "properties": {
        "enter": {
          "x": {"value": -5},
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
}

var CourtXHistogram = {
  "name": "xLocGroup",
  "type": "group",
  "properties": {
    "update": {
      "x": { "value": 0 },
      "y": { "value": 52.5 },
      "width": {"value": 450 },
      "height": {"value": 100 },
      "fill" : {"value": "#fff"}
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
            "test": `${shotFilter(['hoopdistance', 'dist'], ['LOC_Y', 'yLoc'])} && ${ShotChartInteractionFilters.brush}`
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
          "fillOpacity": {
            "rule": [
              {
                "predicate": {"name": "xLocBrush", "x": {"field": "bin_LOC_X"}},
                "value": 0.8
              },
              {"value": 0.2}
            ]
          },
          "x": {"scale": "x", "field": "bin_LOC_X"},
          "width": {"scale": "thickness", "value": 5},
          "y": {"scale": "y", "field": "layout_start"},
          "y2": {"scale": "y", "field": "layout_end"},
          "fill": {"scale": "makeColor", "field": "EVENT_TYPE"}
        },
        "exit": {
          "y": {"scale": "y", "value": 0},
          "y2": {"scale": "y", "value": 0}
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
          "x": {"scale": "x",  "signal": "xLocStart"},
          "x2": {"scale": "x", "signal": "xLocEnd"},
          "y": {"value": 0},
          "y2": {"field": {"group": "height"}}
        }
      }
    }
  ]
}

var CourtYHistogram = {
  "name": "yLocGroup",
  "type": "group",
  "properties": {
    "update": {
      "x": { "value": 450 },
      "y": { "value": 150 },
      "width": {"value": 100 },
      "height": {"value": 660 },
      "fill": {"value": "#fff"}
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
            "test": `${shotFilter(['hoopdistance', 'dist'], ['LOC_X', 'xLoc'])} && ${ShotChartInteractionFilters.brush}`
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
          "fillOpacity": {
            "rule": [
              {
                "predicate": {"name": "yLocBrush", "y": {"field": "bin_LOC_Y"}},
                "value": 0.8
              },
              {"value": 0.2}
            ]
          },
          "y": {"scale": "y", "field": "bin_LOC_Y"},
          "x": {"scale": "x", "field": "layout_start"},
          "x2": {"scale": "x", "field": "layout_end"},
          "height": {"scale": "thickness", "value": 5},
          "fill": {"scale": "makeColor", "field": "EVENT_TYPE"}
        },
        "exit": {
          "x": {"scale": "x", "value": 0},
          "x2": {"scale": "x", "value": 0}
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
          "y": {"scale": "y",  "signal": "yLocStart"},
          "y2": {"scale": "y", "signal": "yLocEnd"},
          "x": {"value": 0},
          "x2": {"field": {"group": "width"}}
        }
      }
    }
  ]
}


export {DistanceHistogram, CourtYHistogram, CourtXHistogram}
