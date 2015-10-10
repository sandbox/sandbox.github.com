import _ from 'lodash'
import { getAccessorName, isAggregateType } from '../helpers/field'

class QuantitativeAggregator {
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
  }
  result() {
    return this._result
  }
  flush() {}
}

class StackAggregator extends QuantitativeAggregator {
  constructor() {
    super(...arguments)
    this.accumulator = 0
  }
  add(value) {
    this.accumulator += value
  }
  flush() {
    super.add(this.accumulator)
    this.accumulator = 0
  }
}

class BinStackAggregator extends QuantitativeAggregator {
  constructor() {
    super(...arguments)
    this.accumulator = {}
  }
  add(value, key) {
    if (null == this.accumulator[key]) this.accumulator[key] = 0
    this.accumulator[key] += value
  }
  flush() {
    let values = _.values(this.accumulator)
    for(let i = 0, len = values.length; i < len; i++) {
      super.add(values[i])
    }
    this.accumulator = {}
  }
}

class OrdinalAggregator {
  constructor() {
    this._result = {}
  }
  add(value) {
    this._result[value] = true
  }
  result() {
    let result = []
    for (let i = 0, keys = Object.keys(this._result), len = keys.length; i < len; i++) {
      result.push(keys[i])
    }
    return result.sort()
  }
  flush() {}
}

function aggregateDatum(aggregator, datum, key, binKey) {
  let binDatum = datum[binKey]
  if (null != datum[key]) {
    aggregator.add(datum[key], binDatum)
  }
  else if (null != datum.values) {
    for(let i = 0, len = datum.values.length; i < len; i++) {
      aggregator.add(datum.values[i][key], binDatum)
    }
  }
  else {
    throw Error(`Domain construction: Not supposed to get here: Missing key ${key} and no values`)
  }
}

export function calculateDomains(tableType, data, panes, fields) {
  let domains = {}
  if (data == null) return domains
  let binField = _.find(fields, f => null != f.binner)

  for (let i = 0, len = fields.length; i < len; i++) {
    let field = fields[i]
    let accessor = getAccessorName(field)
    if (domains[accessor]) continue
    domains[accessor] = ('O' == field.algebraType) ? new OrdinalAggregator() :
      isAggregateType(field) ? (
        binField ? new BinStackAggregator() : new StackAggregator()) :
      new QuantitativeAggregator()
  }

  let binKey = binField ? getAccessorName(binField) : null
  for (let r = 0, rkeys = Object.keys(panes), rlen = rkeys.length, keys = Object.keys(domains), klen=keys.length; r < rlen; r++) {
    let rkey = rkeys[r]
    for (let c = 0, ckeys = Object.keys(panes[rkey]), clen = ckeys.length; c < clen; c++) {
      let ckey = ckeys[c]
      let paneDataIndices = panes[rkey][ckey]
      for (let k = 0; k < klen; k++) {
        let key = keys[k]
        let domain = domains[key]
        for (let i = 0, len = paneDataIndices.length; i < len; i++) {
          aggregateDatum(domain, data[paneDataIndices[i]], key, binKey)
        }
        domain.flush()
      }
    }
  }

  return _.mapValues(domains, (agg) => agg.result())
}
