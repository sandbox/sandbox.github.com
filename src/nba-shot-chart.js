import d3 from 'd3'

d3.json(
  "/public/data/james-harden-shotchartdetail.json.gz",
  function(error, json) {
    if (error) return console.warn(error)
    console.log(json)
  })
