import _ from 'lodash'
import { getFieldQueryType, isStackableField, isBinField } from '../helpers/field'
import { translateSummary } from './local'
import Aggregator from 'datalib/src/aggregate/aggregator'
import dl from 'datalib'

function getPaneIndices(nest, rkey, ckey) {
  let node = nest
  for(let i = 0, len = rkey.length; i < len; i++) {
    node = node[rkey[i]]
    if (node == null) return null
  }
  for(let i = 0, len = ckey.length; i < len; i++) {
    node = node[ckey[i]]
    if (node == null) return null
  }
  return node
}

function flattenGroupedData(data) {
  let result = []
  for(let i = 0, len = data.length; i < len; i++) {
    let datum = data[i]
    let grouped = _.omit(datum, 'values')
    for (let j = 0, vlen = datum.values.length; j < vlen; j++) {
      result.push(_.extend({}, grouped, datum.values[j]))
    }
  }
  return result
}

class PaneData {
  constructor(row, col, data) {
    this.axis = { row, col }
    this.data = data
    this.markData = null
  }
  aggregate(tableType, visualFields, mustCondense) {
    let axisFields = _.filter([this.axis.row.field, this.axis.col.field])
    let fields = axisFields.concat(visualFields)
    let noHasRawValue = _.all(fields, field => 'value' != getFieldQueryType(field))

    let markData = this.data

    // condense data to pane summarized data
    if (mustCondense) {
      let { groupby, operator, aggregate, value } = _.groupBy(fields, getFieldQueryType)
      let condensedData = dl.groupby(_.map(groupby, 'accessor'))
          .summarize(translateSummary(operator, aggregate, value))
          .execute(flattenGroupedData(this.data))
      this.markData = noHasRawValue ? condensedData : flattenGroupedData(condensedData)
    }
    else {
      this.markData = noHasRawValue ? this.data : flattenGroupedData(this.data)
    }
    return this
  }
  addDomainToAxis(tableType, didCondense) {
    // calculate domain for pane data, taking note of bin and stacks
    let isStackable = 'bar' == tableType || 'area' == tableType
    let groupAxis = isBinField(this.axis.row.field) ? this.axis.row :
        isBinField(this.axis.col.field) ? this.axis.col : null
    let stackAxes = _.filter([
      isStackableField(this.axis.row.field) ? this.axis.row : null,
      isStackableField(this.axis.col.field) ? this.axis.col : null])
    let domainData = isStackable && stackAxes.length > 0 ?
        (groupAxis ? dl.groupby([groupAxis.field.accessor]) : dl.groupby()).summarize(
          _.map(stackAxes, axis => { return { name: axis.field.accessor, ops: ['sum'] } })
          ).execute(this.markData) : null
    if (domainData) {
      for (let i = 0, len = domainData.length; i < len; i++) {
        for (let s = 0, slen = stackAxes.length; s < slen; s++) {
          let stackAxis = stackAxes[s]
          stackAxis.addDomainValue(domainData[i][`sum_${stackAxis.field.accessor}`])
        }
      }
    }
    if (didCondense) {
      for (let i = 0, len = this.markData.length; i < len; i++) {
        for (let s = 0, slen = stackAxes.length; s < slen; s++) {
          let stackAxis = stackAxes[s]
          stackAxis.addDomainValue(this.markData[i][stackAxis.field.accessor])
        }
      }
    }
    return this
  }
  sort(sorts) {
    this.markData = _.sortByAll(this.markData, sorts)
    return this
  }
}

export function partitionPaneData(axes, nest, data) {
  let panes = {}
  for(let r = 0, rlen = axes.row.length, clen = axes.col.length; r < rlen; r++) {
    for(let c = 0; c < clen; c++) {
      let raxis = axes.row[r]
      let caxis = axes.col[c]
      if (raxis.acceptsValues && caxis.acceptsValues) {
        if (!panes[r]) panes[r] = {}
        panes[r][c] = new PaneData(raxis, caxis, data)
      }
      else {
        let paneDataIndices = getPaneIndices(nest, raxis.key, caxis.key)
        if (paneDataIndices != null) {
          if (!panes[r]) panes[r] = {}
          panes[r][c] = new PaneData(raxis, caxis, _.at(data, paneDataIndices))
        }
      }
    }
  }
  return panes
}

export function aggregatePanes(panes, tableType, spec, mustCondense) {
  for (let r = 0, rkeys = Object.keys(panes), rlen = rkeys.length; r < rlen; r++) {
    let rkey = rkeys[r]
    for (let c = 0, ckeys = Object.keys(panes[rkey]), clen = ckeys.length; c < clen; c++) {
      let ckey = ckeys[c]
      panes[rkey][ckey].aggregate(tableType, spec, mustCondense)
        .addDomainToAxis(tableType, mustCondense)
        .sort(_.map(spec, 'accessor'))
    }
  }
}
