import _ from 'lodash'

function setProperty(obj, key, value) {
  if (key.length == 0) return
  let i = 0
  let len = key.length - 1
  for(; i < len; i++) {
    if (null == obj[key[i]]) {
      obj[key[i]] = {}
    }
    obj = obj[key[i]]
  }
  obj[key[i]] = value
}

function pushProperty(obj, key, value) {
  if (key.length == 0) return
  let i = 0
  let len = key.length - 1
  for(; i < len; i++) {
    if (null == obj[key[i]]) {
      obj[key[i]] = {}
    }
    obj = obj[key[i]]
  }
  if(null == obj[key[i]]) obj[key[i]] = []
  obj[key[i]].push(value)
}

function nestHasSeen(seen, sofar) {
  for(let i = 0; i < sofar.length; i++) {
    if (!seen[sofar[i].key])
      return false
    seen = seen[sofar[i].key]
  }
  return seen
}

function traverseNestTree(nest, rowLevels, colLevels, level, rowSoFar, colSoFar, seen, result) {
  if (level == rowLevels.length + colLevels.length) {
    if (!nestHasSeen(seen.row, rowSoFar)) {
      setProperty(seen.row, _.map(rowSoFar, 'key'), true)
      result.row.push(rowSoFar)
    }
    if (!nestHasSeen(seen.col, colSoFar)) {
      setProperty(seen.col, _.map(colSoFar, 'key'), true)
      result.col.push(colSoFar)
    }
  }
  else {
    for (let i = 0, keys = Object.keys(nest), l = keys.length; i < l; i++) {
      let k = keys[i]
      traverseNestTree(
        nest[k], rowLevels, colLevels, level + 1,
        level <  rowLevels.length ? rowSoFar.concat([{ key: k, field: rowLevels[level] }]) : rowSoFar,
        level >= rowLevels.length ? colSoFar.concat([{ key: k, field: colLevels[level - rowLevels.length] }]) : colSoFar,
        seen, result)
    }
  }
}

export function partitionNestKey(nest, rowLevels, colLevels) {
  let result = { row: [], col: [] }
  let seen = { row: {}, col: {} }
  traverseNestTree(nest, rowLevels, colLevels, 0, [], [], seen, result)
  return result
}

export function calculateNest(data, key, f = pushProperty) {
  let nest = {}
  for (let i = 0, len = data.length; i < len; i++) {
    f(nest, key(data[i]), i)
  }
  return nest
}
