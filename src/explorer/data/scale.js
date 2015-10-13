import d3 from 'd3'
import _ from 'lodash'
import { getAccessorName, isAggregateType } from '../helpers/field'
import { TABLE_ENCODINGS } from '../helpers/table'
import { COLOR_PALETTES } from '../helpers/color'

function getOrdinalVisualRange(shelf, spec) {
  switch (shelf) {
  case 'color':
    return COLOR_PALETTES[spec.palette]
  default:
    return []
  }
}

function getQuantitativeVisualRange(shelf, spec) {
  return [spec.scaleRangeMin, spec.scaleRangeMax]
}

function getQuantitativeScale(domain, orient, zero) {
  let space = (domain.max - domain.min) / 50
  let min = zero ? Math.min(0, domain.min) : domain.min - space
  let max = (zero ? Math.max(0, domain.max) : domain.max) + space
  return {
    type: 'linear',
    domain: [min, max]
  }
}

function getVisualScale(algebraType, shelf, domain, spec) {
  let scaleType = 'O' == algebraType ? 'ordinal' : 'linear'
  let rangeFn = 'O' == algebraType ? getOrdinalVisualRange : getQuantitativeVisualRange
  let domainFn = 'O' == algebraType ? _.identity : (x => [x.min, x.max])
  return {
    type: scaleType,
    domain: domainFn(domain),
    range: rangeFn(shelf, spec)
  }
}

export function calculateScales(domains, queryspec, visualspec) {
  let validProperties = TABLE_ENCODINGS[visualspec.table.type].properties

  let scales = _(queryspec).pick(['row', 'col']).mapValues(
    (fields, shelf) => {
      return _.reduce(fields, (acc, field) => {
        if ('Q' == field.algebraType) {
          let name = getAccessorName(field)
          let zero = isAggregateType(field)
          acc[name] = getQuantitativeScale(domains[name], shelf, zero)
        }
        return acc
      }, {})
    }).value()

  _.extend(scales, _(queryspec).pick(validProperties).mapValues(
    (fields, shelf) => {
      return _.reduce(fields, (acc, field) => {
        let name = getAccessorName(field)
        acc[name] = getVisualScale(field.algebraType, shelf, domains[name], visualspec.properties[shelf])
        return acc
      }, {})
    }).value())

  return {
    scales: _.extend(
      {},
      _.mapValues(_.pick(visualspec.properties, validProperties), (v) => {
        return { '__default__' : v }
      }), scales)
  }
}
