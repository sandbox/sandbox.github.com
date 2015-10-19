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
    IDS: [0, 1, 2, 3, 4, 5, 6],
    BY_ID: {
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
         },
      3: {
        id: 3, name: "Dataset NBA",
        type: "dataframe",
        schema: [
          { name: "Season" , type: "string" }, { name: "Year"   , type: "integer" }, { name: "Rk"     , type: "integer" }, { name: "Player" , type: "string" }, { name: "Pos"    , type: "string" },
          { name: "Age"    , type: "integer" }, { name: "Tm"     , type: "string" }, { name: "G"      , type: "integer" }, { name: "GS"     , type: "integer" }, { name: "MP"     , type: "integer" },
          { name: "FG"     , type: "integer" }, { name: "FGA"    , type: "integer" }, { name: "FG%"    , type: "number" }, { name: "3P"     , type: "integer" }, { name: "3PA"    , type: "integer" },
          { name: "3P%"    , type: "number" }, { name: "2P"     , type: "integer" }, { name: "2PA"    , type: "integer" }, { name: "2P%"    , type: "number" }, { name: "eFG%"   , type: "number" },
          { name: "FT"     , type: "integer" }, { name: "FTA"    , type: "integer" }, { name: "FT%"    , type: "number" }, { name: "ORB"    , type: "integer" }, { name: "DRB"    , type: "integer" },
          { name: "TRB"    , type: "integer" }, { name: "AST"    , type: "integer" }, { name: "STL"    , type: "integer" }, { name: "BLK"    , type: "integer" }, { name: "TOV"    , type: "integer" },
          { name: "PF"     , type: "integer" }, { name: "PTS"    , type: "integer" },
          { name: "Season with a really long name that hsould try to voerflow the thing" , type: "string" }, { name: "Year"   , type: "integer" }, { name: "Rk"     , type: "integer" }, { name: "Player" , type: "string" }, { name: "Pos"    , type: "string" },
          { name: "Age"    , type: "integer" }, { name: "Tm"     , type: "string" }, { name: "G"      , type: "integer" }, { name: "GS"     , type: "integer" }, { name: "MP"     , type: "integer" },
          { name: "FG"     , type: "integer" }, { name: "FGA"    , type: "integer" }, { name: "FG%"    , type: "number" }, { name: "3P"     , type: "integer" }, { name: "3PA"    , type: "integer" },
          { name: "3P%"    , type: "number" }, { name: "2P"     , type: "integer" }, { name: "2PA"    , type: "integer" }, { name: "2P%"    , type: "number" }, { name: "eFG%"   , type: "number" },
          { name: "FT"     , type: "integer" }, { name: "FTA"    , type: "integer" }, { name: "FT%"    , type: "number" }, { name: "ORB"    , type: "integer" }, { name: "DRB"    , type: "integer" },
          { name: "TRB"    , type: "integer" }, { name: "AST"    , type: "integer" }, { name: "STL"    , type: "integer" }, { name: "BLK"    , type: "integer" }, { name: "TOV"    , type: "integer" },
          { name: "PF"     , type: "integer" }, { name: "PTS"    , type: "integer" },

          { name: "Season" , type: "string" }, { name: "Year"   , type: "integer" }, { name: "Rk"     , type: "integer" }, { name: "Player" , type: "string" }, { name: "Pos"    , type: "string" },
          { name: "Age"    , type: "integer" }, { name: "Tm"     , type: "string" }, { name: "G"      , type: "integer" }, { name: "GS"     , type: "integer" }, { name: "MP"     , type: "integer" },
          { name: "FG"     , type: "integer" }, { name: "FGA"    , type: "integer" }, { name: "FG%"    , type: "number" }, { name: "3P"     , type: "integer" }, { name: "3PA"    , type: "integer" },
          { name: "3P%"    , type: "number" }, { name: "2P"     , type: "integer" }, { name: "2PA"    , type: "integer" }, { name: "2P%"    , type: "number" }, { name: "eFG%"   , type: "number" },
          { name: "FT"     , type: "integer" }, { name: "FTA"    , type: "integer" }, { name: "FT%"    , type: "number" }, { name: "ORB"    , type: "integer" }, { name: "DRB"    , type: "integer" },
          { name: "TRB"    , type: "integer" }, { name: "AST"    , type: "integer" }, { name: "STL"    , type: "integer" }, { name: "BLK"    , type: "integer" }, { name: "TOV"    , type: "integer" },
          { name: "PF"     , type: "integer" }, { name: "PTS"    , type: "integer" },
          { name: "Season with a really long name that hsould try to voerflow the thing" , type: "string" }, { name: "Year"   , type: "integer" }, { name: "Rk"     , type: "integer" }, { name: "Player" , type: "string" }, { name: "Pos"    , type: "string" },
          { name: "Age"    , type: "integer" }, { name: "Tm"     , type: "string" }, { name: "G"      , type: "integer" }, { name: "GS"     , type: "integer" }, { name: "MP"     , type: "integer" },
          { name: "FG"     , type: "integer" }, { name: "FGA"    , type: "integer" }, { name: "FG%"    , type: "number" }, { name: "3P"     , type: "integer" }, { name: "3PA"    , type: "integer" },
          { name: "3P%"    , type: "number" }, { name: "2P"     , type: "integer" }, { name: "2PA"    , type: "integer" }, { name: "2P%"    , type: "number" }, { name: "eFG%"   , type: "number" },
          { name: "FT"     , type: "integer" }, { name: "FTA"    , type: "integer" }, { name: "FT%"    , type: "number" }, { name: "ORB"    , type: "integer" }, { name: "DRB"    , type: "integer" },
          { name: "TRB"    , type: "integer" }, { name: "AST"    , type: "integer" }, { name: "STL"    , type: "integer" }, { name: "BLK"    , type: "integer" }, { name: "TOV"    , type: "integer" },
          { name: "PF"     , type: "integer" }, { name: "PTS"    , type: "integer" },

          { name: "Season" , type: "string" }, { name: "Year"   , type: "integer" }, { name: "Rk"     , type: "integer" }, { name: "Player" , type: "string" }, { name: "Pos"    , type: "string" },
          { name: "Age"    , type: "integer" }, { name: "Tm"     , type: "string" }, { name: "G"      , type: "integer" }, { name: "GS"     , type: "integer" }, { name: "MP"     , type: "integer" },
          { name: "FG"     , type: "integer" }, { name: "FGA"    , type: "integer" }, { name: "FG%"    , type: "number" }, { name: "3P"     , type: "integer" }, { name: "3PA"    , type: "integer" },
          { name: "3P%"    , type: "number" }, { name: "2P"     , type: "integer" }, { name: "2PA"    , type: "integer" }, { name: "2P%"    , type: "number" }, { name: "eFG%"   , type: "number" },
          { name: "FT"     , type: "integer" }, { name: "FTA"    , type: "integer" }, { name: "FT%"    , type: "number" }, { name: "ORB"    , type: "integer" }, { name: "DRB"    , type: "integer" },
          { name: "TRB"    , type: "integer" }, { name: "AST"    , type: "integer" }, { name: "STL"    , type: "integer" }, { name: "BLK"    , type: "integer" }, { name: "TOV"    , type: "integer" },
          { name: "PF"     , type: "integer" }, { name: "PTS"    , type: "integer" },
          { name: "Season with a really long name that hsould try to voerflow the thing" , type: "string" }, { name: "Year"   , type: "integer" }, { name: "Rk"     , type: "integer" }, { name: "Player" , type: "string" }, { name: "Pos"    , type: "string" },
          { name: "Age"    , type: "integer" }, { name: "Tm"     , type: "string" }, { name: "G"      , type: "integer" }, { name: "GS"     , type: "integer" }, { name: "MP"     , type: "integer" },
          { name: "FG"     , type: "integer" }, { name: "FGA"    , type: "integer" }, { name: "FG%"    , type: "number" }, { name: "3P"     , type: "integer" }, { name: "3PA"    , type: "integer" },
          { name: "3P%"    , type: "number" }, { name: "2P"     , type: "integer" }, { name: "2PA"    , type: "integer" }, { name: "2P%"    , type: "number" }, { name: "eFG%"   , type: "number" },
          { name: "FT"     , type: "integer" }, { name: "FTA"    , type: "integer" }, { name: "FT%"    , type: "number" }, { name: "ORB"    , type: "integer" }, { name: "DRB"    , type: "integer" },
          { name: "TRB"    , type: "integer" }, { name: "AST"    , type: "integer" }, { name: "STL"    , type: "integer" }, { name: "BLK"    , type: "integer" }, { name: "TOV"    , type: "integer" },
          { name: "PF"     , type: "integer" }, { name: "PTS"    , type: "integer" }
        ]
      },
      4: {
        id: 4, name: "Coffee Chain",
        type: "db",
        protocol: "psql",
        tables: [
          {
            name: "Products", type: "table", schema: [
              { name: "Profit"  , type: "number" },
              { name: "Sales"   , type: "number" },
              { name: "Year"    , type: "number" },
              { name: "Quarter" , type: "string" },
              { name: "Month"   , type: "string" },
              { name: "Region"  , type: "string" },
              { name: "State"   , type: "string" },
              { name: "Product" , type: "string" }
            ],
            datasource_id: 4
          },
          {
            name: "Customers", type: "table", schema: [
              { name: "Purchases"   , type: "number" },
              { name: "Money Spent" , type: "number" },
              { name: "Year"        , type: "number" },
              { name: "Created At"  , type: "timestamp" },
              { name: "Quarter"     , type: "string" },
              { name: "Month"       , type: "string" },
              { name: "State"       , type: "string" },
            ],
            datasource_id: 4
          }
        ]
      },
      5: {
        id: 5, name: "Second Coffee Chain",
        type: "db",
        protocol: "psql",
        tables: [
          {
            name: "Products", type: "table", schema: [
              { name: "Profit"  , type: "number" },
              { name: "Sales"   , type: "number" },
              { name: "Year"    , type: "number" },
              { name: "Quarter" , type: "string" },
              { name: "Month"   , type: "string" },
              { name: "Region"  , type: "string" },
              { name: "State"   , type: "string" },
              { name: "Product" , type: "string" }
            ],
            datasource_id: 5
          },
          {
            name: "Customers", type: "table", schema: [
              { name: "Purchases"   , type: "number" },
              { name: "Money Spent" , type: "number" },
              { name: "Year"        , type: "number" },
              { name: "Created At"  , type: "timestamp" },
              { name: "Quarter"     , type: "string" },
              { name: "Month"       , type: "string" },
              { name: "State"       , type: "string" },
            ],
            datasource_id: 5
          }
        ]
      },
      6: {
        id: 6, name: "Third Coffee Chain",
        type: "db",
        protocol: "psql",
        tables: [
          {
            name: "Products", type: "table", schema: [
              { name: "Profit"  , type: "number" },
              { name: "Sales"   , type: "number" },
              { name: "Year"    , type: "number" },
              { name: "Quarter" , type: "string" },
              { name: "Month"   , type: "string" },
              { name: "Region"  , type: "string" },
              { name: "State"   , type: "string" },
              { name: "Product" , type: "string" }
            ],
            datasource_id: 6
          },
          {
            name: "Customers", type: "table", schema: [
              { name: "Purchases"   , type: "number" },
              { name: "Money Spent" , type: "number" },
              { name: "Year"        , type: "number" },
              { name: "Created At"  , type: "timestamp" },
              { name: "Quarter"     , type: "string" },
              { name: "Month"       , type: "string" },
              { name: "State"       , type: "string" },
            ],
            datasource_id: 6
          }
        ]
      }}}}

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
