import _ from 'lodash'

function getPaneIndices(nest, rkey, ckey) {
  let node = nest
  for(let i = 0, len = rkey.length; i < len; i++) {
    node = node[rkey[i]]
    if (node == null) return null
  }
  for(let i = 0, len = ckey.length; i < len; i++) {
    node = node[ckey[i]]
    if (node == null) return null
  }
  return node
}

export function partitionPaneData(axes, nest, data) {
  let panes = {}
  let dataIndices = _.range(data.length)

  for(let r = 0, rlen = axes.row.length, clen = axes.col.length; r < rlen; r++) {
    for(let c = 0; c < clen; c++) {
      let raxis = axes.row[r]
      let caxis = axes.col[c]
      if (raxis.acceptsValues && caxis.acceptsValues) {
        if (!panes[r]) panes[r] = {}
        panes[r][c] = dataIndices
      }
      else {
        let paneDataIndices = getPaneIndices(nest, raxis.key, caxis.key)
        if (paneDataIndices != null) {
          if (!panes[r]) panes[r] = {}
          panes[r][c] = paneDataIndices
        }
      }
    }
  }

  return panes
}
