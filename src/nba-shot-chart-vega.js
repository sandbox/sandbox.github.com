import d3 from 'd3'
import vg from 'vega'
import { ShotChartSpec } from './components/basketball'

// harden 201935
// curry 201939
// kobe 977
// lebron 2544
// korver 2594
// klay 202691
// westbrook 201566
// durant 201142
// dirk 1717
// rose 201565

var ShotChartView
var Cache = {}
var shotChartUrls = [
  {"name": "James Harden (2014-2015)",  "url": "https://gist.githubusercontent.com/sandbox/7f6065c867a5f355207e/raw/5c74a5dcd7b257faa985f28c932a684ed4cea065/james-harden-shotchartdetail.json"},
  {"name": "Stephen Curry (2014-2015)", "url": "https://gist.githubusercontent.com/sandbox/7f6065c867a5f355207e/raw/d159840109c00928f515bf0ed496f4f487b326ba/stephen-curry-shotchartdetail.json" },
  {"name": "Kobe Bryant (2007-2008)",   "url": "https://gist.githubusercontent.com/sandbox/7f6065c867a5f355207e/raw/0fbd65f9f795a5fba8c8ccefce060fd3082264fb/kobe-2007-2008-shot-chart.json" },
  {"name": "Kobe Bryant (2009-2010)",   "url": "https://gist.githubusercontent.com/sandbox/7f6065c867a5f355207e/raw/a19ec840d7d67c388fc3f2eea3d51c9b7cdcf4b0/kobe-2009-2010-shot-chart.json" },
  {"name": "Lebron James (2009-2010)",  "url": "https://gist.githubusercontent.com/sandbox/7f6065c867a5f355207e/raw/0fbd65f9f795a5fba8c8ccefce060fd3082264fb/lebron-james-2009-2010-shot-chart.json" },
  {"name": "Lebron James (2010-2011)",  "url": "https://gist.githubusercontent.com/sandbox/7f6065c867a5f355207e/raw/0fbd65f9f795a5fba8c8ccefce060fd3082264fb/lebron-james-2010-2011-shot-chart.json" },
  {"name": "Lebron James (2011-2012)",  "url": "https://gist.githubusercontent.com/sandbox/7f6065c867a5f355207e/raw/d53dbb96502622b9509880fb671cf50846130636/lebron-james-2011-2012-shot-chart.json" },
  {"name": "Lebron James (2012-2013)",  "url": "https://gist.githubusercontent.com/sandbox/7f6065c867a5f355207e/raw/d53dbb96502622b9509880fb671cf50846130636/lebron-james-2012-2013-shot-chart.json" },
  {"name": "Kevin Durant (2013-2014)",  "url": "https://gist.githubusercontent.com/sandbox/7f6065c867a5f355207e/raw/d53dbb96502622b9509880fb671cf50846130636/kevin-durant-2013-2014-shot-chart.json" }
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
