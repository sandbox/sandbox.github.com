import d3 from 'd3'
import vg from 'vega'
import { ShotChartSpec } from './components/basketball'

var ShotChartView
var Cache = {}
var shotChartUrls = [
  {"name": "James Harden", "url": "https://gist.githubusercontent.com/sandbox/7f6065c867a5f355207e/raw/5c74a5dcd7b257faa985f28c932a684ed4cea065/james-harden-shotchartdetail.json"},
  {"name": "Stephen Curry", "url": "https://gist.githubusercontent.com/sandbox/7f6065c867a5f355207e/raw/d159840109c00928f515bf0ed496f4f487b326ba/stephen-curry-shotchartdetail.json" }
]

vg.parse.spec(ShotChartSpec, function(chart) {
  ShotChartView = chart({el: "#shot-chart"})
  renderShotChart({ target: { value: shotChartUrls[0].url }})
})

function setChartData(data) {
  ShotChartView.data('table').remove(() => true).insert(data)
  ShotChartView.update({duration: 300, ease: "quad-in-out"})
}

function renderShotChart(evt) {
  let url = evt.target.value
  if (Cache[url]) {
    setChartData(Cache[url])
  } else {
    d3.json(
      url,
      function(error, json) {
        if (error) return console.warn(error)
        let headers = json.resultSets[0].headers
        let data = json.resultSets[0].rowSet.map(function(d) {
          let row = headers.reduce(function(memo, header, i) {
            memo[header] = d[i]
            return memo
          }, {})
          row.shot_id = `${row.GAME_ID}_${row.GAME_EVENT_ID}`
          return row})
        Cache[url] = data
        setChartData(Cache[url])
      })
  }
}

React.render(<select onChange={renderShotChart}>
             {shotChartUrls.map(function(player) {
               return <option key={player.url} value={player.url}>{player.name}</option>
             })}
             </select>, document.getElementById("shot-chart-player-select"))
