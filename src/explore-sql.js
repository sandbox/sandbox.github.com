require('es6-promise').polyfill()
import './explorer/css/main.scss'

import React from 'react'
import ReactDOM from 'react-dom'
import d3 from 'd3'
import dl from 'datalib'

import _ from 'lodash'
import { Provider } from 'react-redux'

import Explorer from './explorer'
import configureStore from './explorer/stores'
import { selectTable, connectTableIfNecessary } from './explorer/ducks/datasources'
import * as queryspec from './explorer/ducks/queryspec'

let MockDataSources = {
  datasources: {
    IDS: [0, 1, 7, 2],
    BY_ID: {
      7: { id: 7, name: "Iris",
           type: "dataframe",
           url: "http://vega.github.io/polestar/data/iris.json",
           settings: { format: "json" }
         },
      0: { id: 0, name: "Birdstrikes",
           type: "dataframe",
           url: "http://vega.github.io/polestar/data/birdstrikes.json",
           settings: { format: "json" }
         },
      1: { id: 1, name: "Cars",
           type: "dataframe",
           url: "http://vega.github.io/polestar/data/cars.json",
           settings: { format: "json" }
         },
      2: { id: 2, name: "NBA League Totals per year",
           type: "dataframe",
           url: "https://gist.githubusercontent.com/sandbox/7f6065c867a5f355207e/raw/f6d6496474af6dfba0b73f36dbd0e00ce0fc2f42/leagues_NBA_player_totals.csv",
           settings: { format: "csv", delimiter: "," }
         }
    }}}

_.each(MockDataSources.datasources.BY_ID,
       datasource => {
         _(datasource.tables).each(
           (table) =>
             _(table.schema).each((field, i) => field.__id__ = i).value()).value()
         _(datasource.schema).each((field, i) => field.__id__ = i).value()
       })

let store = configureStore(MockDataSources)

ReactDOM.render(<Provider store={store}><Explorer/></Provider>, document.getElementById("demo"))

store.dispatch(connectTableIfNecessary({datasource_id: 0})).then(
  () => {
    store.dispatch(selectTable({datasource_id: 0}))

    store.dispatch(queryspec.addField('row', {
      "tableId": {
        id: 0, name: "Birdstrikes"
      },
      "fieldId": 1
    }))

    store.dispatch(queryspec.addField('row', {
      id: "agg_count", name: "COUNT" , type: "aggregate" , op: "count"
    }))

    store.dispatch(queryspec.addField('col', {
      "tableId": {
        id: 0, name: "Birdstrikes"
      },
      "fieldId": 3,
      "func": "year"
    }))

    store.dispatch(queryspec.addField('color', {
      "tableId": {
        id: 0, name: "Birdstrikes"
      },
      "fieldId": 7
    }))
  })
