import _ from 'lodash'
import dl from 'datalib'
import { getFieldType, getBinStepUnit, getBinStep } from '../helpers/field'
import { prepareAxes } from './axis'
import { partitionPaneData } from './pane'
import { calculateDomains } from './domain'

function getFieldQueryType(field) {
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

function getGroupByName(data, field) {
  if (_.contains(field.func, 'bin')) {
    if ('time' == getFieldType(field)) {
      let b = dl.bins.date({
        type: 'date',
        maxbins: 1000,
        unit: getBinStepUnit(field.func)
      })
      b.step = getBinStep(field.func)
      let func = dl.$func('bin', x => b.value(b.unit.unit(x)))(dl.$(field.name))
      func.step = b.step
      return func
    }
    else {
      let accessor = dl.$(field.name)
      let [min, max] = dl.extent(data, accessor)
      let b = dl.bins({maxbins: 1000, min, max})
      let func = dl.$func('bin', x => b.value(x))(accessor)
      func.step = b.step
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

function translateTableQuery(queryspec, data) {
  if (_.isEmpty(queryspec)) return null
  const {groupby, operator, aggregate, value} = _(queryspec).values().flatten().groupBy(getFieldQueryType).value()

  let summarize = _.merge(
    _(aggregate).groupBy('name').mapValues(fields => _.map(fields, 'func')).value(),
    operator ? { '*': operator.map(field => field.op) } : {},
    value ? { '*': ['values'] } : {},
    (a, b) => { if (_.isArray(a)) { return a.concat(b) } })

  return {
    groupby: _.map(groupby, _.curry(getGroupByName)(data)),
    summarize,
    where: [],
    having: [],
    order: []
  }
}

export function performQuery(query, data) {
  if (query == null) return null
  return dl.groupby(query.groupby).summarize(query.summarize).execute(data)
}

export function requestQuery(queryspec, datasource) {
  let query = translateTableQuery(queryspec, datasource)
  let data = performQuery(query, datasource)
  let domains = calculateDomains(data, _(queryspec).map(fields => fields).flatten().value())
  let { axes, nest } = query ? prepareAxes(queryspec, query, data) : {}
  let panes = query ? partitionPaneData(axes, nest, data) : {}
  return { query, queryspec, data, axes, domains, panes }
}
