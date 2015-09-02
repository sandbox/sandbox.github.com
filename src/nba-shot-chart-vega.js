import d3 from 'd3'
import vg from 'vega'
import { ShotChartSpec } from './components/basketball'

d3.json(
  "https://gist.githubusercontent.com/sandbox/7f6065c867a5f355207e/raw/5c74a5dcd7b257faa985f28c932a684ed4cea065/james-harden-shotchartdetail.json",
  function(error, json) {
    if (error) return console.warn(error)
    let headers = json.resultSets[0].headers
    let data = json.resultSets[0].rowSet.map(function(d) {
      let row = headers.reduce(function(memo, header, i) {
        memo[header] = d[i]
        return memo
      }, {})
      row.__id = `${row.GAME_ID}_${row.GAME_EVENT_ID}`
      return row})
    vg.parse.spec(
      ShotChartSpec,
      function(chart) {
        let view = chart({el: "#shot-chart"})
        view.data('table').insert(data)
        view.update({duration: 1000, ease: "linear"})
      })
  })
