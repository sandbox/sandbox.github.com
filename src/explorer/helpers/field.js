import _ from 'lodash'

export const AGGREGATES = [
  { id: "agg_count", name: "COUNT" , type: "aggregate" , op: "count" }
]

export function getFieldType(field) {
  let type = field.typecast != null ? field.typecast : field.type
  return getExternalType(type)
}

export function getAlgebraType(field) {
  switch(getFieldType(field)) {
  case 'text':
    return 'O'
  default:
    return 'Q'
  }
}

export function getExternalType(type) {
  switch(type) {
  case 'date':
  case 'timestamp':
    return 'time'
  case 'string':
    return 'text'
  case 'integer':
    return 'number'
  default:
    return type
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
  case 'text': case 'time': case 'number':
    return _.capitalize(func)
  default:
    return func && func.toUpperCase()
  }
}

export function getFieldFunctionDisplayName(func) {
  switch(func) {
  case "bin[ms]":  return "by Millisecond"
  case "bin[s]":   return "by Second"
  case "bin[m]":   return "by Minute"
  case "bin[h]":   return "by Hour"
  case "bin[d]":   return "by Day"
  case "bin[w]":   return "by Week"
  case "bin[M]":   return "by Month"
  case "bin[Q]":   return "by Quarter"
  case "bin[6M]":  return "by 6 Month"
  case "bin[Y]":   return "by Year"
  case "bin[5Y]":  return "by 5 Year"
  case "bin[10Y]": return "by 10 Year"
  default:
    return getFieldFunctionSelectDisplayName(func)
  }
}

export function getBinStepUnit(func) {
  switch(func) {
  case "bin[ms]": case "bin[s]":                return "second"
  case "bin[m]":                                return "minute"
  case "bin[h]":                                return "hour"
  case "bin[d]": case "bin[w]":                 return "day"
  case "bin[M]": case "bin[Q]": case "bin[6M]": return "month"
  default:
    return 'year'
  }
}

export function getBinStep(func) {
  switch(func) {
  case "bin[ms]": case "bin[s]": case "bin[m]": case "bin[h]": case "bin[d]":
    return 1
  case "bin[w]":   return 7
  case "bin[M]":   return 1
  case "bin[Q]":   return 3
  case "bin[6M]":  return 6
  case "bin[Y]":   return 1
  case "bin[5Y]":  return 5
  case "bin[10Y]": return 10
  default:
    return 1
  }
}
