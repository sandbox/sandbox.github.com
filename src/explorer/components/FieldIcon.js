import React from 'react'
import className from 'classnames'
import { getExternalType } from '../helpers/field'
const {div, i: icon, span} = React.DOM

export class FieldIcon extends React.Component {
  render() {
    const { type, typecast } = this.props
    if (typecast != null && getExternalType(typecast) != getExternalType(type)) {
      return div({},
                 <FieldIcon type={type} />,
                 icon({className: "fa fa-long-arrow-right"}),
                 <FieldIcon type={typecast} />)
    }

    let iconClass
    if (type == 'aggregate') {
      iconClass = "bar-chart"
    } else if (['date', 'timestamp', 'time'].indexOf(type) >= 0) {
      iconClass = "clock-o"
    } else if (["string", "text"].indexOf(type) >= 0) {
      iconClass = "font"
    } else if (['integer', 'number'].indexOf(type) >= 0) {
      return span({}, "#")
    } else {
      return span({}, type)
    }
    return icon({className: className("fa", `fa-${iconClass}`)})
  }
}
