import dl from 'datalib'
import _ from 'lodash'
import { calculateNest, partitionNestKey } from './nest'

class Axis {
  constructor(ordinals = [], field = null) {
    this.ordinals = ordinals
    this.key = _.map(ordinals, 'key')
    this.acceptsValues = _.isEmpty(this.key)
    this.field = field
  }
  cross(field) {
    return _.extend(new Axis(), this, {field})
  }
  hasQuantitativeField() {
    return null != this.field
  }
  map(f) {
    let result = []
    for(let i=0, len=this.ordinals.length; i < len; i++) {
      result.push(f(this.ordinals[i], i))
    }
    if (null != this.field) result.push(f(this.field, 'Q'))
    return result
  }
  label() {
    return `${this.key.join(' ')}${this.field ? ` ${this.field.name}` : ''}`
  }
}

// nest ordinal fields then cross with concat-quantitative fields to build the axis
export function prepareAxes(queryspec, query, data) {
  let shelves   = _(queryspec).mapValues(fields => _.groupBy(fields, 'algebraType')).value()
  let accessors = _(shelves).pick('row', 'col').map((shelf) => _.map(shelf.O, 'name')).flatten().map(dl.$).value()
  let nest      = _.isEmpty(accessors) ? {} : calculateNest(data, (datum) => _.map(accessors, f => f(datum)))
  let rowLevels = shelves.row && shelves.row.O ? shelves.row.O : []
  let colLevels = shelves.col && shelves.col.O ? shelves.col.O : []
  let ordinalAxesKeys  = _.mapValues(
    partitionNestKey(nest, rowLevels, colLevels),
    (axis, shelf) => {
      axis = _.sortByAll(axis, ..._.times('row' == shelf ? rowLevels.length : colLevels.length, i => `${i}.key`))
      return _.isEmpty(axis) ? [ new Axis() ] : _.map(axis, ordinals => new Axis(ordinals))
    })

  let axes = _.mapValues(ordinalAxesKeys, (axis, shelf) => {
    let qfields = shelves[shelf] && shelves[shelf].Q
    if (_.isEmpty(qfields)) return axis
    return _(axis).map(ordinalAxis => _.map(qfields, field => ordinalAxis.cross(field))).flatten().value()
  })

  return { axes, nest }
}
