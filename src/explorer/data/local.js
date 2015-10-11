import _ from 'lodash'
import dl from 'datalib'
import { prepareAxes } from './axis'
import { partitionPaneData, aggregatePanes } from './pane'
import { calculateDomains } from './domain'
import { translateTableQuery } from './translate'
import { isGroupByField } from '../helpers/field'

export function performQuery(query, data) {
  if (query == null) return null
  return dl.groupby(query.groupby).summarize(query.summarize).execute(data)
}

export function requestQuery(tableType, queryspec, datasource) {
  let query = translateTableQuery(queryspec, datasource)
  let result = performQuery(query, datasource)
  let { axes, nest } = query ? prepareAxes(queryspec, result) : {}
  let panes = query ? partitionPaneData(axes, nest, result) : {}
  aggregatePanes(
    panes, tableType,
    _(queryspec).omit('row', 'col').omit(_.isEmpty).values().flatten().value(),
    _(queryspec).pick('row', 'col').omit(_.isEmpty).values().flatten().filter(
      field => 'Q' == field.algebraType && isGroupByField(field)
    ).size() > 1
  )
  let domains = calculateDomains(result, _(queryspec).values().flatten().value(), axes)
  return { query, queryspec, result, axes, domains, panes }
}
