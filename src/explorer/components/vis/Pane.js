import React from 'react'
import { getFieldQueryType, getAccessorName } from '../../helpers/field'

const MARKS = {
  'bar': React.createFactory(require('./marks/Bar')),
  'line': React.createFactory(require('./marks/Line')),
  'area': React.createFactory(require('./marks/Area')),
  'point': React.createFactory(require('./marks/Point'))
}

export class Pane extends React.Component {
  render() {
    const { fieldScales, paneData, rowAxis, colAxis } = this.props
    const { markData } = paneData
    let transformFields = _.filter(
      fieldScales,
      (fs) => {
        return fs.scale && (
          (fs.shelf != 'col' && fs.shelf != 'row')
            || ((fs.shelf == 'row' && rowAxis.hasField(fs.field))
                ||
                (fs.shelf == 'col' && colAxis.hasField(fs.field))))
      })

    let markComponent = MARKS[this.props.markType]
    if (markComponent) {
      return markComponent(_.extend({markData, transformFields}, this.props))
    }
    else {
      return null
    }
  }
}
