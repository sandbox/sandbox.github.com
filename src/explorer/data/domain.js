import _ from 'lodash'

function _accessorName(field) {
  return field.func ? `${_.contains(field.func, 'bin') ? 'bin' : field.func}_${field.name}` : field.op ? field.op : field.name
}

class QuantitativeAggregator {
  constructor() {
    this._result = {min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY}
  }
  add(value) {
    if (_.isArray(value)) {
      for(let v = 0; v < value.length; v++) {
        this.add(value[v])
      }
      return
    }

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
}

export function calculateDomains(data, fields) {
  let domains = {}

  if (data == null) return domains

  for (let i = 0, len = fields.length; i < len; i++) {
    let field = fields[i]
    let accessor = _accessorName(field)
    if (domains[accessor]) continue
    domains[accessor] = ('O' == field.algebraType) ? new OrdinalAggregator() : new QuantitativeAggregator()
  }

  for (let i = 0, keys = Object.keys(domains), len = data.length, klen = keys.length; i < len; i++) {
    let datum = data[i]
    for (let k = 0; k < klen; k++) {
      let key = keys[k]
      if (null != datum[key]) {
        domains[key].add(datum[key])
      }
      else if (null != datum.values) {
        domains[key].add(_.map(datum.values, key))
      }
      else {
        throw Error(`Not supposed to get here: Missing key ${key} and no values`)
      }
    }
  }

  return _.mapValues(domains, (agg) => agg.result())
}
