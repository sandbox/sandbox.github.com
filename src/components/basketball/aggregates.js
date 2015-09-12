var ShotAggregates = {
  "type": "group",
  "properties": {
    "update": {
      "x": { "value": 0 },
      "y": { "value": 2.5 },
      "width": { "value": 500 },
      "height": { "value": 50 }
    }
  },
  "scales": [
    {
      "name": "xfgp",
      "type": "linear",
      "range": [250, 350],
      // "reverse" : true, // hoop on bottom view
      "domain": [0, 1]
    },
    {
      "name": "xppa",
      "type": "linear",
      "range": [375, 475],
      // "reverse" : true, // hoop on bottom view
      "domain": [0, 3]
    }
  ],
  "marks": [
    {
      "type": "rect",
      "from": {"data": "rects"},
      "properties": {
        "update": {
          "width":  { "field": "width" },
          "height": { "field": "height" },
          "x":      { "field": "x"},
          "fill": {
            "value": {
              "id": "rgb",
              "x1": 0.0,
              "y1": 0.0,
              "x2": 1.0,
              "y2": 0.0,
              "stops": [
                {"color": "#e6550d", "offset": 0.0},
                {"color": "#31a354", "offset": 0.5},
                {"color": "#31a354", "offset": 1},
              ]
            }
          }
        }
      }
    },
    {
      "from": {"data": "rects"},
      "type": "text",
      "properties": {
        "enter": {
          "x": {"field": "x"},
          "y": {"value": -5},
          "text": {"field": "text"},
          "fill": {"value": "black"},
          "fontSize": {"value": 14},
          "fontWeight": {"value": "bold"}
        }
      }
    },
    {
      "from": {"data": "percentages"},
      "type": "text",
      "properties": {
        "update": {
          "x": {"value": 0},
          "dx": {"value": 0},
          "y": {"value": 25},
          "text": {
            "template": "{{datum.count | number:','}}"
          },
          "fill": {"value": "black"},
          "fontSize": {"value": 30}
        }
      }
    },
    {
      "from": {"data": "percentages"},
      "type": "text",
      "properties": {
        "update": {
          "x": {"value": 125},
          "dx": {"value": 0},
          "y": {"value": 25},
          "text": {
            "template": "{{datum.sum_MADE_POINTS | number:','}}"
          },
          "fill": {"value": "black"},
          "fontSize": {"value": 30}
        }
      }
    },
    {
      "from": {"data": "percentages"},
      "type": "text",
      "properties": {
        "update": {
          "x": {"value": 250},
          "dx": {"value": 10},
          "y": {"value": 45},
          "text": {
            "template": "{{datum.FGP | number:'.1%'}}"
          },
          "fill": {"value": "black"},
          "fontSize": {"value": 30}
        }
      }
    },
    {
      "from": {"data": "percentages"},
      "type": "text",
      "properties": {
        "update": {
          "x": {"value": 375},
          "dx": {"value": 10},
          "y": {"value": 45},
          "text": {
            "template": "{{datum.PPA | number:'.2f'}}"
          },
          "fill": {"value": "black"},
          "fontSize": {"value": 30}
        }
      }
    },
    {
      "from": {"data": "percentages"},
      "type": "symbol",
      "properties": {
        "update": {
          "shape": { "value": "triangle-up" },
          "x": {"scale": "xfgp", "field": "FGP"},
          "y": {"value": 15},
          "size": {"value": 40},
          "fill": {"value": "black"}
        }
      }
    },
    {
      "from": {"data": "percentages"},
      "type": "symbol",
      "properties": {
        "update": {
          "shape": { "value": "triangle-up" },
          "x": {"scale": "xppa", "field": "PPA"},
          "y": {"value": 15},
          "size": {"value": 40},
          "fill": {"value": "black"}
        }
      }
    }
  ]
}

export { ShotAggregates }
