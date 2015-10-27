import { getAccessorName } from '../../../helpers/field'
import _ from 'lodash'

function cumsum(array, sum_fn = _.identity) {
  let sum = 0
  let current_sum
  let result = _.map(array, a => {
    current_sum = sum
    sum += sum_fn(a)
    return current_sum
  })
  result.push(sum)
  return result
}

export function stackLayout(markData, name, binField) {
  let accessor = _.property(name)
  if (!binField) {
    let stacked = cumsum(markData, accessor)
    return (d, i) => stacked[i]
  }
  else {
    let sums = {}
    let binName = getAccessorName(binField.field)
    let stacked = _.map(
      markData,
      a => {
        if(null == sums[a[binName]]) sums[a[binName]] = 0
        let current_sum = sums[a[binName]]
        sums[a[binName]] += a[name]
        return current_sum
      })
    return (d, i) => stacked[i]
  }
}

export function stackGroupedLayout(groupMarkData, name, binField) {
  let stacked
  if (!binField) {
    let sum = 0
    stacked = _.map(
      groupMarkData,
      a => {
        return _.map(
          a.values,
          b => {
            let current_sum = sum
            sum += b[name]
            return current_sum
          })})
  }
  else {
    let sums = {}
    let binName = getAccessorName(binField.field)
    stacked = _.map(
      groupMarkData,
      a => {
        return _.map(
          a.values,
          b => {
            if(null == sums[b[binName]]) sums[b[binName]] = 0
            let current_sum = sums[b[binName]]
            sums[b[binName]] += b[name]
            return current_sum
          })})
  }

  return (d, level, i) => stacked[level][i]
}
