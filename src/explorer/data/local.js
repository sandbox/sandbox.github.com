import dl from 'datalib'
import { getFieldType, getBinStepUnit, getBinStep } from '../helpers/field'

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
      return dl.$func('bin', x => b.value(b.unit.unit(x)))(dl.$(field.name))
    }
    else {
      return dl.$bin(data, field.name, {maxbins: 1000})
    }
  }
  else if (_.contains(['year', 'month', 'day', 'date', 'hour', 'minute', 'second'], field.func)) {
    return dl[`$${field.func}`](field.name)
  }
  else {
    return field.name
  }
}

function translateTableQuery(getField, queryspec, data) {
  if (_.all(queryspec, (v, k) => _.isEmpty(v))) return null
  const {groupby, operator, aggregate, value} = _(queryspec)
        .mapValues((fields) => {
          return _.map(fields,
                       (field) => {
                         return _.extend({}, field.fieldId ? getField(field.fieldId) : {}, field)
                       })
        })
        .reject((fields, shelf) => _.isEmpty(fields)).flatten()
        .groupBy(getFieldQueryType).value()

  let fieldSummaries = _(aggregate).reduce((acc, field) => {
    acc[field.name] = acc[field.name] ? acc[field.name] : []
    acc[field.name].push(field.func)
    return acc
  }, {})

  let summarize = _.merge(
    operator ? { '*': ['count'] } : {},
    value ? { '*': ['values'] } : {},
    (a, b) => { if (_.isArray(a)) { return a.concat(b) } })
  _.merge(summarize, fieldSummaries)

  return {
    groupby: _.map(groupby, _.curry(getGroupByName)(data)),
    summarize: summarize,
    where: [],
    having: [],
    order: []
  }
}

export function performQuery(query, data) {
  if (query == null) return null
  return dl.groupby(query.groupby).summarize(query.summarize).execute(data)
}

export function requestQuery(getField, queryspec, data) {
  let query = translateTableQuery(getField, queryspec, data)
  return { query, data: performQuery(query, data) }
}
