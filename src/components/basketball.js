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

export {CourtBounds, BasketBall}
