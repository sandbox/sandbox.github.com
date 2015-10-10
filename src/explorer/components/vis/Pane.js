import React from 'react'
import { getFieldQueryType, getAccessorName } from '../../helpers/field'

const MARKS = {
  'bar': React.createFactory(require('./marks/Bar'))
}

export class Pane extends React.Component {
  render() {
    const { fieldScales, paneData, rowAxis, colAxis } = this.props
    let transformFields = _.filter(
      fieldScales,
      (fs) => {
        return fs.scale && (
          (fs.shelf != 'col' && fs.shelf != 'row')
            || (rowAxis.hasField(fs.field) || colAxis.hasField(fs.field)))
      })

    let markData = _.all(transformFields, fs => 'value' != getFieldQueryType(fs.field)) ?
        _(paneData) : _(paneData).map((d) => {
          let grouped = _.omit(d, 'values')
          return _.map(d.values, (v) => _.extend({}, grouped, v))
        }).flatten()

    let sortFields = _(transformFields).filter(
      fs => fs.shelf != 'row' && fs.shelf != 'col'
    ).map(fs => getAccessorName(fs.field)).value()

    markData = markData.sortByAll(sortFields).value()

    let markComponent = MARKS[this.props.markType]
    if (markComponent) {
      return markComponent(_.extend({markData, transformFields}, this.props))
    }
    else {
      return null
    }
  }
}
