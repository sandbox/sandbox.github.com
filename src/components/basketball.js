import { describeArc } from './arc'

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
  "width":  600,
  "height": 1.1 * 600,
  "padding": {"top": 30, "left": 179, "bottom": 30, "right": 179},
  "data": [
    { "name": "table" },
    { "name": "courtBounds", "values": [{"x": -250, "x2": -250 + 500, "y": -47.5, "y2": -47.5 + 470}] },
    { "name": "arcs",
      "values": [
        {"x": 0, "y": -47.5 + 470, "radius": 60, "startAngle": Math.PI/2, "endAngle": 3/2 * Math.PI},
        {"x": 0, "y": -47.5 + 470, "radius": 20, "startAngle": Math.PI/2, "endAngle": 3/2 * Math.PI},
        {"x": 0, "y": 0, "radius": 40, "startAngle": -Math.PI/2, "endAngle": Math.PI/2},
        {"x": 0, "y": 0, "radius": 237.5, "startAngle": -68 / 180 * Math.PI, "endAngle": 68 / 180 * Math.PI},
        {"x": 0, "y": 0, "radius": 7.5, "startAngle": 0, "endAngle": 2 * Math.PI},
        {"x": 0, "y": 142.5, "radius": 60, "startAngle": -Math.PI/2, "endAngle": Math.PI/2},
        {"strokeDash": [5, 14], "x": 0, "y": 142.5, "radius": 60, "startAngle": -Math.PI/2, "endAngle": -3/2 * Math.PI}
      ]},
    { "name": "courtLines",
      "values": [
        { "x": 22, "y": -7.5, "x2": -22, "y2": -8.5 },
        { "x": 60, "y": 150-7.5, "x2": -60, "y2": -47.5 },
        { "x": 80, "y": 150-7.5, "x2": -80, "y2": -47.5 },
        { "x": -220, "y": 90, "x2": -220.2, "y2": -47.5 },
        { "x": 220.2, "y": 90, "x2": 220, "y2": -47.5 }
      ]},
  ],
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
      "domain": [-250, 250],
      "reverse": true
    },
    {
      "name": "y",
      "type": "linear",
      "range": "height",
      "domain": [-50, 500]
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
      "range": ["#EA4929", "#9FBC91"]
    }
  ],
  "legends": [
    {
      "fill": "makeColor"
    }
  ],
  "marks": [
    {
      "type": "symbol",
      "from": {"data": "table"},
      "key": "__id",
      "properties": {
        "enter": {
          "shape": "circle",
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
          "startAngle": {"field": "startAngle"},
          "endAngle": {"field": "endAngle"}
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
          "x":  {"scale": "x", "field": "x"},
          "y":  {"scale": "y", "field": "y"},
          "x2": {"scale": "x", "field": "x2"},
          "y2": {"scale": "y", "field": "y2"}
        }
      }
    },
    {
      "type": "rect",
      "from": {"data": "courtBounds"},
      "properties": {
        "enter": {
          "stroke": {"value": "#000000"},
          "x": {"scale": "x", "field": "x"},
          "y": {"scale": "y", "field": "y"},
          "x2": {"scale": "x", "field": "x2"},
          "y2": {"scale": "y", "field": "y2"}
        }
      }
    }
  ]
}

export {CourtBounds, BasketBall, ShotChartSpec}
