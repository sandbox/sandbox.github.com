export const TABLE_ENCODINGS = {
  bar:   {
    name: "Bar",
    icon: [{
      className: "fa fa-bar-chart"}],
    properties: ['color', 'opacity'] },
  point: {
    name: "Symbol",
    icon: [{
      className: "material-icons",
      style: {
        position: 'relative',
        top: 4,
        fontSize: 22}},
           "grain"],
    properties: ['size',
                 'color',
                 'opacity',
                 'shape'] },
  line:  {
    name: "Line",
    icon: [{
      className: "fa fa-line-chart"}],
    properties: ['color'] },
  area:  {
    name: "Area",
    icon: [{
      className: "fa fa-area-chart"}],
    properties: ['color'] },
  rect:  {
    name: "Gantt Bar",
    icon: [{
      className: "material-icons",
      style: {
        position: 'relative',
        top: 4,
        fontSize: 22}},
           "clear_all"],
    properties: ['x',
                 'x2',
                 'y',
                 'y2',
                 'size',
                 'color'] },
  box:   {
    name: "Box Plot",
    icon: [{
      className: "material-icons",
      style: {
        position: 'relative',
        top: 4,
        fontSize: 18}},
           "tune"],
    properties: ['color'] },
  pie:   {
    name: "Pie",
    icon: [{
      className: "fa fa-pie-chart"}],
    properties: ['color'] },
  donut: {
    name: "Donut",
    icon: [
      {
        className: "material-icons",
        style: {
          position: 'relative',
          top: 4,
          fontSize: 18
        }},
      "data_usage"],
    properties: ['color']
  }
}
