React = require('react')
className = require('classnames')
dl = require('datalib')

class Testing extends React.Component
  render: ->
    <div/>

class DataSource extends React.Component
  render: ->
    switch(@props.type)
      when 'table', 'dataframe'
        return <div onClick={loadTable.bind(@, @props)}><i className="fa fa-table"/>{@props.name}</div>
      when 'db'
        return <div>
            <div><i className="fa fa-database"/>{@props.name}</div>
            <div>{@props.tables.map((table, i) -> <DataSource key={i} {...table} />)}</div>
          </div>

class DataSourceSelect extends React.Component
  constructor: ->
    super()
    @state = { open: false }

  render: ->
    dropdown = if @state.open
      <div className="data-source-dropdown">{@props.sources.map((datasource) -> <DataSource key={datasource.id} {...datasource} />)}</div>
    else null

    return <div className="data-source-select" onClick={=> @setState({open: !@state.open}) }>
      <div><i className="fa fa-table"/>{if @props.table then @props.table.name else "Set data..."}<i className="fa fa-caret-down"/></div>
      {dropdown}
    </div>

class FieldIcon extends React.Component
  render: ->
    switch(this.props.type)
      when "date", "timestamp"
        iconClass = "clock-o"
      when "string"
        iconClass = "font"
      when "integer", "number"
        return <span>#</span>
      else
        return <span>{this.props.type}</span>

    return <i className={className("fa", "fa-#{iconClass}")} />

class TableField extends React.Component
  render: ->
    <div><FieldIcon type={this.props.type}/>{this.props.name}</div>

class TableSchema extends React.Component
  render: ->
    return null unless @props.table?
    return <div>{@props.table.schema.map((field, i) -> <TableField key={field.id || i} {...field} />)}</div>

class DataSelector extends React.Component
  render: ->
    <div className="chart-data">
      <DataSourceSelect sources={@props.sources} table={@props.table}/>
      <TableSchema table={@props.table}/>
    </div>

# action
loadTable = (table) ->
  return if table.loading

  if table.schema?
    setTable(table)
  else if table.url?
    table.loading = true
    dl[table.settings.format](
      table.url,
      (error, dataframe) ->
        table.data = dataframe
        table.schema = _.map(dataframe.__types__, (v, k) -> {name: k, type: v})
        setTable(table)
    )
  return

setTable = (table) ->
  React.render(<DataSelector sources={DATASOURCES} table={table}/>, document.getElementById("table-builder"))

module.exports = { setTable, DataSource }
