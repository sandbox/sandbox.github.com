import React from 'react'
import className from 'classnames'
const {div, i: icon, span} = React.DOM

export function getExternalType(type) {
  switch(type) {
  case 'date':
  case 'timestamp':
    return 'time'
  case 'string':
    return 'text'
  case 'integer':
  case 'number':
    return 'number'
  default:
    return type
  }
}

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

export function getFieldFunctionSelectDisplayName(func) {
  switch(func) {
  case "bin[ms]":  return "Millisecond"
  case "bin[s]":   return "Second"
  case "bin[m]":   return "Minute"
  case "bin[h]":   return "Hour"
  case "bin[d]":   return "Day"
  case "bin[w]":   return "Week"
  case "bin[M]":   return "Month"
  case "bin[Q]":   return "Quarter"
  case "bin[6M]":  return "6 Month"
  case "bin[Y]":   return "Year"
  case "bin[5Y]":  return "5 Year"
  case "bin[10Y]": return "10 Year"
  default:
    return _.capitalize(func)
  }
}

export function getFieldFunctionDisplayName(func) {
  switch(func) {
  case "bin[ms]":  return "BIN[Millisecond]"
  case "bin[s]":   return "BIN[Second]"
  case "bin[m]":   return "BIN[Minute]"
  case "bin[h]":   return "BIN[Hour]"
  case "bin[d]":   return "BIN[Day]"
  case "bin[w]":   return "BIN[Week]"
  case "bin[M]":   return "BIN[Month]"
  case "bin[Q]":   return "BIN[Quarter]"
  case "bin[6M]":  return "BIN[6 Month]"
  case "bin[Y]":   return "BIN[Year]"
  case "bin[5Y]":  return "BIN[5 Year]"
  case "bin[10Y]": return "BIN[10 Year]"
  default:
    return getFieldFunctionSelectDisplayName(func)
  }
}
