import _ from 'lodash'
import dl from 'datalib'
import { getFieldType, getBinStepUnit, getBinStep, getFieldQueryType } from '../helpers/field'
import { prepareAxes } from './axis'
import { partitionPaneData } from './pane'
import { calculateDomains, calculateVisualDomains } from '../data/domain'

function getGroupByName(data, field) {
  if (_.contains(field.func, 'bin')) {
    if ('time' == getFieldType(field)) {
      let b = dl.bins.date({
        type: 'date',
        maxbins: 100,
        unit: getBinStepUnit(field.func)
      })
      b.step = getBinStep(field.func)
      let func = dl.$func('bin', x => b.value(b.unit.unit(x)))(dl.$(field.name))
      func.step = b.step
      field.binner = func
      return func
    }
    else {
      let accessor = dl.$(field.name)
      let [min, max] = dl.extent(data, accessor)
      let b = dl.bins({maxbins: 100, min, max})
      let func = dl.$func('bin', x => b.value(x))(accessor)
      func.step = b.step
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

function translateTableQuery(queryspec, data) {
  if (_.isEmpty(queryspec)) return null
  const {groupby, operator, aggregate, value} = _(queryspec).values().flatten().groupBy(getFieldQueryType).value()

  let summarize = _.merge(
    _(aggregate).groupBy('name').mapValues(fields => _.map(fields, 'func')).value(),
    operator ? { '*': operator.map(field => field.op) } : {},
    { '*': ['values'] },
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

export function requestQuery(tableType, queryspec, datasource) {
  let query = translateTableQuery(queryspec, datasource)
  let result = performQuery(query, datasource)
  let { axes, nest } = query ? prepareAxes(queryspec, query, result) : {}
  let panes = query ? partitionPaneData(axes, nest, result) : {}
  let domainFields = _(queryspec).map(fields => fields).flatten().value()
  let domains = calculateDomains(tableType, result, panes, domainFields)
  return { query, queryspec, result, axes, domains, panes }
}
