import className from 'classnames'
import React from 'react'
import _ from 'lodash'

const { div, pre } = React.DOM

export class TableGraphic extends React.Component {
  render() {
    const { isLoading, query, data, error,
            queryspec, visualspec,
            axes, domains, panes } = this.props
    if (query == null || queryspec == null || data == null || error)
      return div({className: "container-flex-fill-wrap graphic-container"},
                 div({className: "container-flex-fill"},
                     div({}, `${error ? "Error: " : ""}No Chart`)))

    return div({className: "container-flex-fill-wrap graphic-container"},
               isLoading ? div({}, 'Loading') : null,
               div({className: "container-flex-fill"},
                   pre({}, JSON.stringify({query,
                                           data: data ? data.slice(0, 10).map(_.curryRight(_.omit, 2)('values')) : data,
                                           isLoading,
                                           error}, null, 2)),
                   pre({}, JSON.stringify(_.mapValues(axes, _.curryRight(_.take, 2)(20)), null, 2)),
                   pre({}, JSON.stringify(_.take(_.first(_.first(panes)), 100), null, 2))))
  }
}
