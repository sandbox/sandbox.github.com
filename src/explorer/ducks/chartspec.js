import _ from 'lodash'
import u from 'updeep'
import { prepareAxes } from '../data/axis'
import { partitionPaneData, aggregatePanes } from '../data/pane'
import { calculateDomains } from '../data/domain'
import { calculateScales } from '../data/scale'

export const UPDATE_CHART_DATA = 'explorer/chartspec/UPDATE_CHART_DATA'

export function updateChartData(key, visualspec, queryResponse) {
  return {
    type: UPDATE_CHART_DATA,
    key,
    queryResponse,
    visualspec
  }
}

const chartState = {
}

export default function reducer(state = chartState, action) {
  switch(action.type) {
  case UPDATE_CHART_DATA:
    const { visualspec } = action
    const tableType = visualspec.table.type
    if (_.get([action.key, tableType], state)) return state

    const { query, queryspec, result } = action.queryResponse
    const { axes, nest } = query ? prepareAxes(queryspec, result) : {}
    const panes = query ? partitionPaneData(axes, nest, result) : {}
    aggregatePanes(
      panes, tableType,
      _(queryspec).omit('row', 'col').omit(_.isEmpty).values().flatten().value(),
      _(queryspec).pick('row', 'col').omit(_.isEmpty).mapValues(
        fields => _(fields).where({algebraType: 'Q'}).size()
      ).values().flatten().max() > 1)
    const domains = calculateDomains(result, _(queryspec).values().flatten().value(), axes)

    return u.updateIn(
      [action.key, tableType],
      {
        axes,
        panes,
        domains,
        scales: calculateScales(domains, queryspec, visualspec)
      },
      state)
  default:
    return state
  }
}
