import className from 'classnames'
import React from 'react'
import _ from 'lodash'

const { div, pre } = React.DOM

export class TableGraphic extends React.Component {
  render() {
    return div({className: "container-flex-fill-wrap graphic-container"},
               div({className: "container-flex-fill"},
                   "GRAPHIC BUILDER",
                   pre({}, JSON.stringify(this.props.queryspec, null, 2))))
  }
}
