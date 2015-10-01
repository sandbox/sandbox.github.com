import className from 'classnames'
import React from 'react'
import _ from 'lodash'

const { div, pre } = React.DOM

export class TableGraphic extends React.Component {
  render() {
    const { isLoading, query, data, error, visualspec } = this.props

    return div({className: "container-flex-fill-wrap graphic-container"},
               isLoading ? div({}, 'Loading') : null,
               div({className: "container-flex-fill"},
                   error ?
                   div({},
                       "Error: No Chart",
                       pre({}, JSON.stringify({query, isLoading, error}, null, 2))) :
                   [
                     pre({key: 1}, JSON.stringify({query,
                                             data: data ? data.slice(0, 10).map(_.curryRight(_.omit, 2)('values')) : data,
                                             isLoading,
                                             error}, null, 2)),
                     pre({key: 2}, JSON.stringify(visualspec, null, 2))
                   ]))
  }
}
