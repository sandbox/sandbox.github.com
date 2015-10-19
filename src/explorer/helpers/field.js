import _ from 'lodash'
import dl from 'datalib'

export const AGGREGATES = [
  { id: "agg_count", name: "COUNT" , type: "aggregate" , op: "count" }
]

export function getAccessorName(field) {
  return field.func ? `${_.contains(field.func, 'bin') ? 'bin' : field.func}_${field.name}` : field.op ? field.op : field.name
}

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

export function getFieldQueryType(field) {
  if ('text' == getFieldType(field)
      || _.contains(field.func, "bin")
      || _.contains(['year', 'month', 'day', 'date', 'hour', 'minute', 'second'], field.func)) {
    return 'groupby'
  }
  else if ('aggregate' == field.type) {
    return 'operator'
  }
  else if (field.func && _.contains(['count', 'sum', 'min', 'max', 'mean', 'median'], field.func.toLowerCase())) {
    return 'aggregate'
  }
  else {
    return 'value'
  }
}

export function isAggregateType(field) {
  return _.contains(['operator', 'aggregate'], getFieldQueryType(field))
}

export function isGroupByField(field) {
  return 'groupby' == getFieldQueryType(field)
}

export function isStackableField(field) {
  return field && ('aggregate' == field.type || field.func && _.contains(['sum', 'count'], field.func.toLowerCase()))
}

export function isBinField(field) {
  return field && field.func && (_.contains(field.func, "bin") || _.contains(['year', 'month', 'day', 'date', 'hour', 'minute', 'second'], field.func))
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

export function getFieldGroupByName(data, field) {
  if (_.contains(field.func, 'bin')) {
    if ('time' == getFieldType(field)) {
      let b = dl.bins.date({
        type: 'date',
        maxbins: 50,
        unit: getBinStepUnit(field.func)
      })
      b.step = getBinStep(field.func)
      let func = dl.$func('bin', x => b.value(b.unit.unit(x)))(dl.$(field.name))
      field.binner = func
      field.binSettings = b
      return func
    }
    else {
      let accessor = dl.$(field.name)
      let [min, max] = dl.extent(data, accessor)
      let b = dl.bins({maxbins: 50, min, max, minstep: 'integer' == field.type ? 1 : 0})
      let func = dl.$func('bin', x => b.value(x))(accessor)
      field.binSettings = b
      field.binner = func
      return func
    }
  }
  else if (_.contains(['year', 'month', 'day', 'date', 'hour', 'minute', 'second'], field.func)) {
    return dl[`$${field.func}`](field.name)
  }
  else {
    return field.name
  }
}
