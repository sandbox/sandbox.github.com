import _ from 'lodash'
import { getFieldType, getAccessorName, isAggregateType, isBinField, isGroupByField } from '../helpers/field'

export class QuantitativeAggregator {
  constructor() {
    this._result = {min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY}
  }
  add(value) {
    if(value < this._result.min) {
      this._result.min = value
    }
    if(value > this._result.max) {
      this._result.max = value
    }
    return this
  }
  result() {
    return this._result
  }
  flush() {
    return this
  }
}

export class OrdinalAggregator {
  constructor() {
    this._result = {}
  }
  add(value) {
    this._result[value] = true
    return this
  }
  result() {
    let result = []
    for (let i = 0, keys = Object.keys(this._result), len = keys.length; i < len; i++) {
      result.push(keys[i])
    }
    return result.sort()
  }
  flush() {
    return this
  }
}

function aggregateDatum(aggregator, datum, key, binWidth) {
  if (null != datum[key]) {
    aggregator.add(datum[key])
    if(binWidth) aggregator.add(binWidth(datum[key]))
  }
  else if (null != datum.values) {
    for(let i = 0, len = datum.values.length; i < len; i++) {
      aggregator.add(datum.values[i][key])
      if(binWidth) aggregator.add(binWidth(datum.values[i][key]))
    }
  }
  else {
    throw Error(`Domain construction: Not supposed to get here: Missing key ${key} and no values`)
  }
}

function aggregateAxes(domains, axes) {
  for (let i = 0, len = axes.length; i < len; i++) {
    let axis = axes[i]
    if (null == axis.domain) continue
    let domain = axis.getDomain()
    domains[axis.field.accessor].add(domain.min).add(domain.max)
  }
}

const AGGREGATOR = {
  'Q' : QuantitativeAggregator,
  'O' : OrdinalAggregator
}

function nextStep(step) {
  return (d) => d + step
}

function nextTime(timeUnit, step) {
  return (d) => d3.time[timeUnit].offset(d, step)
}

export function calculateDomains(data, fields, axes) {
  let domains = {}
  if (data == null) return domains

  let isBin = {}
  for (let i = 0, len = fields.length; i < len; i++) {
    let field = fields[i]
    if (domains[field.accessor]) continue
    domains[field.accessor] = new AGGREGATOR[field.algebraType]()
    isBin[field.accessor] = isBinField(field) ?
      ('time' == getFieldType(field) && !_.contains(field.func, 'bin')
       ? nextStep(1)
       : 'time' == getFieldType(field)
       ? nextTime(field.binSettings.unit.type, field.binSettings.step)
       : nextStep(field.binSettings.step)) : null
  }

  aggregateAxes(domains, axes.row)
  aggregateAxes(domains, axes.col)
  for (let i = 0, keys = Object.keys(domains), len = data.length, klen = keys.length; i < len; i++) {
    let datum = data[i]
    for (let k = 0; k < klen; k++) {
      let key = keys[k]
      aggregateDatum(domains[key], datum, key, isBin[key])
    }
  }

  return _.mapValues(domains, (agg) => agg.result())
}
