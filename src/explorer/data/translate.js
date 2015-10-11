import _ from 'lodash'
import { getFieldQueryType, getFieldGroupByName } from '../helpers/field'

export function translateTableQuery(queryspec, data) {
  if (_.isEmpty(queryspec)) return null
  const {groupby, operator, aggregate, value} = _(queryspec).values().flatten().groupBy(getFieldQueryType).value()

  let summarize = translateSummary(operator, aggregate, value)
  return {
    groupby: _.map(groupby, _.curry(getFieldGroupByName)(data)),
    summarize,
    where: [],
    having: [],
    order: []
  }
}

export function translateSummary(operator, aggregate, value) {
  return _.merge(
    _(aggregate).groupBy('name').mapValues(fields => _.map(fields, 'func')).value(),
    operator ? { '*': _.map(operator, 'op') } : {},
    { '*': ['values'] },
    (a, b) => { if (_.isArray(a)) { return a.concat(b) } })
}
