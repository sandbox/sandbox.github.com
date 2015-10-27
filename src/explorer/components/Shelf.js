import d3 from 'd3-svg-legend'
import className from 'classnames'
import React from 'react'
import ReactDOM from 'react-dom'
import { DropTarget } from 'react-dnd'
import _ from 'lodash'
import { VisualPropertiesDropdown } from './VisualPropertiesDropdown'
import { FieldOptionsDropdown } from './FieldDropdown'
import { createDropdownComponent } from '../../components/Dropdown'
import { ShelfField, calculateDropMarkPosition, calculateDropPosition, FieldDropHandler, fieldDropCollector } from './Field'
import { getAccessorName, isAggregateType } from '../helpers/field'

const { div, i: icon, a: link, pre, svg } = React.DOM
const { findDOMNode } = ReactDOM

class FieldContainer extends React.Component {
  componentDidUpdate(prevProps, prevState) {
    if (this.hasDropMarker()) {
      findDOMNode(this.refs.dropMarker).style.left = `${calculateDropMarkPosition(this, this.state.hoverDropOffset)}px`
    }
  }

  hasDropMarker() {
    return _.contains(['row', 'col'], this.props.shelf) && this.props.fields.length > 0 && this.props.isOver && this.props.dropOffset
  }

  render() {
    const { shelf, fields, getField, removeField, dropdownProps } = this.props
    const { isOver, canDrop, connectDropTarget } = this.props
    const hasDropMarker = this.hasDropMarker()

    const dropPosition = hasDropMarker ? div({
      ref: "dropMarker",
      className: "field-position-marker"
    }) : null

    const shelfFields = fields.map(
      function(field, i) {
        const fieldSettings = field.type == 'aggregate' ? field : getField(field.tableId, field.fieldId)
        return <ShelfField ref={`field:${i}`} key={`${i}:${field.type == 'aggregate' ? field.id : field.fieldId}`} shelf={shelf} field={field} position={i} {...fieldSettings} remove={() => removeField(shelf, i)} {...dropdownProps} />
      })
    return connectDropTarget(
      div(
        {
          className: className("querybuilder-field-container-wrap",
                               {
                                 "field-drop-target": canDrop,
                                 "field-drop-over":   isOver,
                                 "field-contained":   !_.isEmpty(fields),
                                 "field-empty":       _.isEmpty(fields),
                                 "field-drop-marker": hasDropMarker
                               }),
          onScroll: dropdownProps.closeDropdown
        },
        div({className: "querybuilder-field-container"},
            dropPosition,
            shelfFields)))
  }
}
FieldContainer = DropTarget(["TableField", "ShelfField"], FieldDropHandler, fieldDropCollector)(FieldContainer)

const LEGEND_TYPE = {
  color: 'color',
  opacity: 'color',
  shape: 'symbol',
  size: 'size'
}

class ShelfLegend extends React.Component {
  _d3Remove() {
    d3.select(this.refs.d3LegendContainer).selectAll('*').remove()
  }

  _d3Render() {
    this._d3Remove()
    let { fields, legend, shelf } = this.props
    if (_.isEmpty(fields)) return
    let scaleObject = legend[getAccessorName(fields[0])]
    if (null == scaleObject) return
    let { type, domain, range } = scaleObject
    let scale = d3.scale[type]().domain(domain).range(range)
    switch(shelf) {
    case 'shape':
      scale.range(_.map(scale.range(), shape => d3.svg.symbol().type(shape)()))
      break
    case 'size':
      scale.range(_.map(scale.range(), v => Math.sqrt(v / Math.PI)))
      break
    case 'opacity':
      scale.range(_.map(range, o => d3.rgb(255 * (1 - o), 255 * (1 - o), 255 * (1 - o))))
    }
    let svgLegend = d3.legend[LEGEND_TYPE[shelf]]().scale(scale)
    switch(shelf) {
    case 'size':
      svgLegend.shape('circle').shapePadding(5)
    }
    switch(type) {
    case 'linear': case 'log': case 'pow': case 'sqrt':
      let ticks = scale.ticks(5)
      if ('linear' == type && isAggregateType(fields[0])) ticks = _.unique(_.sortBy(ticks.concat([0])))
      if ('log' == type) ticks = _.at(ticks, _.range(0, ticks.length, Math.floor(ticks.length / 5)))
      svgLegend.cells(ticks).labelFormat(d3.format(",f"))
      break
    case 'quantile':
      svgLegend.cells(scale.quantiles()).labelFormat(d3.format(",f"))
    }
    let node = d3.select(this.refs.d3LegendContainer)
    let elem = findDOMNode(this)
    let legendElem = node.append('g').attr("transform", _.contains(['shape', 'size'], shelf) ? "translate(15, 5)" : null).call(svgLegend)
    let legendBounds = legendElem[0][0].getBoundingClientRect()
    node.attr("width", legendBounds.width + 5).attr("height", legendBounds.height + 5)
  }

  componentDidMount() {
    this._d3Render()
  }

  componentDidUpdate() {
    this._d3Render()
  }

  componentWillUnmount() {
    this._d3Remove()
  }

  render() {
    if (_.isEmpty(this.props.fields)) return null
    return div({className: "querybuilder-shelf-legend"},
               svg({ref: 'd3LegendContainer'}))
  }
}

class Shelf extends React.Component {
  render() {
    const { name, shelf, fields, legend, getField,
            removeField, clearFields,
            insertFieldAtPosition, moveFieldTo,
            replaceFieldOnShelf, moveAndReplaceField,
            dropdownProps, vizActionCreators } = this.props
    const containerProps = { shelf, fields, getField,
                             removeField, clearFields, insertFieldAtPosition, moveFieldTo, replaceFieldOnShelf, moveAndReplaceField,
                             dropdownProps }
    const visualSettingsProps = {
      property: shelf, fields, getField,
      settings: this.props.properties,
      isOpen: this.props.isDropdownOpen && !dropdownProps.isDropdownOpen,
      close: this.props.closeDropdown,
      ...vizActionCreators
    }
    const isRowColShelf = _.contains(['row', 'col'], this.props.shelf)
    const hasDropdownSettings = _.contains(['color', 'background'], this.props.shelf)
    const optionComponent =
          isRowColShelf ? icon({className: 'fa fa-times remove-link', onClick: () => {
            dropdownProps.closeDropdown()
            clearFields(shelf)}}) : hasDropdownSettings ? icon({className: 'fa fa-caret-down'}) : null
    return div({className: "querybuilder-shelf"},
               <label onClick={hasDropdownSettings ? () => {
                 if (dropdownProps.isDropdownOpen) {
                   this.props.openDropdown()
                 } else {
                   this.props.toggleDropdown()
                 }
                 dropdownProps.closeDropdown()
               } : null} style={{cursor: hasDropdownSettings ? 'pointer' : null}}>{name}{optionComponent}</label>,
               <VisualPropertiesDropdown {...visualSettingsProps} />,
               <FieldContainer {...containerProps} />,
               !isRowColShelf && legend ? <ShelfLegend shelf={shelf} legend={legend} fields={_.map(
                 fields,
                 (field) => _.extend({}, field, getField(field.tableId, field.fieldId)))} /> : null)
  }
}
Shelf = createDropdownComponent(Shelf)

export { Shelf }
