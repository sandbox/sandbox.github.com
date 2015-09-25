import className from 'classnames'
import React from 'react'
import { DropTarget } from 'react-dnd'
import _ from 'lodash'
import { FieldOptionsDropdown } from './FieldDropdown'
import { createDropdownComponent } from '../../components/Dropdown'
import { ShelfField, calculateDropMarkPosition, calculateDropPosition, FieldDropHandler, fieldDropCollector } from './Field'

const { div, i: icon, a: link, pre } = React.DOM
const { findDOMNode } = React

const TABLE_ENCODINGS = [
  "pivot",
  "bar",
  "line",
  "point",
  "rect",
  "area",
  "box",
  "pie",
  "donut"
]

const ICON_FOR = {
  pivot: [{className: "fa fa-table"}],
  bar:   [{className: "fa fa-bar-chart"}],
  line:  [{className: "fa fa-line-chart"}],
  point: [{className: "material-icons", style: {position: 'relative', top: 4, fontSize: 22}}, "grain"],
  rect:  [{className: "material-icons", style: {position: 'relative', top: 4, fontSize: 22}}, "clear_all"],
  area:  [{className: "fa fa-area-chart"}],
  box:   [{className: "material-icons", style: {position: 'relative', top: 4, fontSize: 18}}, "tune"],
  pie:   [{className: "fa fa-pie-chart"}],
  donut: [{className: "material-icons", style: {position: 'relative', top: 4, fontSize: 18}}, "data_usage"]
}

const ENCODING_MARK_ATTRIBUTES = {
  pivot: ['background', 'color'],
  bar:   ['size', 'color', 'opacity', 'orientation'],
  line:  ['color', 'opacity'],
  point: ['size', 'color', 'shape', 'opacity', 'orientation'],
  rect:  ['x', 'x2', 'y', 'y2', 'size', 'color', 'opacity'],
  area:  ['color'],
  box:   ['color'],
  pie:   ['color'],
  donut: ['color']
}

const ATTRIBUTE_DISPLAY = {
  size:        "Size",
  shape:       "Shape",
  color:       "Color",
  background:  "Background Color",
  opacity:     "Opacity",
  orientation: "Orientation",
  x:           "X Position Start",
  x2:          "X Position End",
  y:           "Y Position Start",
  y2:          "Y Position End",
  text:        "Text"
}

class ShelfAttribute extends React.Component {
  render() {
    const { fields, shelf, getField, removeField, dropdownProps } = this.props
    const { connectDropTarget, isOver, canDrop } = this.props
    const shelfFields = fields.map(
      function(field, i) {
        const fieldSettings = field.type == 'aggregate' ? field : getField(field.tableId, field.fieldId)
        return <ShelfField ref={`field:${i}`} key={`${i}:${field.type == 'aggregate' ? field.id : field.fieldId}`} shelf={shelf} field={field} position={i} {...fieldSettings} {...dropdownProps} remove={() => removeField(shelf, i)} />
      })
    return connectDropTarget(
      div({className: 'shelf-attribute'},
          div({className: 'shelf-attribute-title'},
              ATTRIBUTE_DISPLAY[shelf]),
          div({className: className('shelf-attribute-value', {
            "field-drop-target": canDrop,
            "field-drop-over": isOver,
            "field-contained": !_.isEmpty(fields),
            "field-empty": _.isEmpty(fields)})},
              shelfFields)))
  }
}
ShelfAttribute = DropTarget(["TableField", "ShelfField"], FieldDropHandler, fieldDropCollector)(ShelfAttribute)

class TableSettings extends React.Component {
  render() {
    const { getField, fieldActionCreators, dropdownProps } = this.props
    const mark_attributes = ENCODING_MARK_ATTRIBUTES[this.props.preview || this.props.table.type]
    return div({className: "container-flex-fill-wrap"},
               div({className: "container-flex-fill"},
                   mark_attributes.map((attr) => {
                     return <ShelfAttribute key={attr} shelf={attr} fields={this.props.queryspec[attr]} getField={getField} {...fieldActionCreators} dropdownProps={dropdownProps} />
                   })))
  }
}

class TableChoice extends React.Component {
  render() {
    return div(
      {
        onMouseEnter: (evt) => this.props.setPreview(this.props.value),
        onMouseLeave: (evt) => this.props.setPreview(null),
        onClick: (evt) => this.props.setTableEncoding(this.props.value),
        className: className("tablebuilder-type-choice", {active: this.props.active})
      },
      link({}, icon(...ICON_FOR[this.props.value])))
  }
}

class TableSelect extends React.Component {
  render() {
    const { setPreview, setTableEncoding } = this.props
    const shelfActions = { setPreview, setTableEncoding }
    return div({className: "tablebuilder-type-select"},
               TABLE_ENCODINGS.map(
                 (encoding) =>
                   <TableChoice key={encoding} active={encoding === this.props.active} value={encoding} {...shelfActions} />))
  }
}

class ShelfPane extends React.Component {
  constructor() {
    super(...arguments)
    this.state = { previewTableType: null, optionField: null }
    this.setPreview = this.setPreview.bind(this)
    this.setOptionField = this.setOptionField.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.isDropdownOpen) {
      this.setState({ optionField: null })
    } else if (nextProps.isDragging) {
      this.props.closeDropdown()
      this.setState({ optionField: null })
    }
  }

  setPreview(value) {
    this.setState({ previewTableType: value, optionField: null })
    this.props.closeDropdown()
  }

  setOptionField(shelf, position, bounds) {
    if (this.state.optionField == null || (!_.eq(_.pick(this.state.optionField, 'shelf', 'position'), {shelf, position}))) {
      const container = findDOMNode(this).getBoundingClientRect()
      this.props.openDropdown()
      this.setState({ optionField: { shelf, position, top: bounds.bottom - container.top - 1, left: bounds.left - container.left } })
    } else {
      this.props.closeDropdown()
      this.setState({ optionField: null })
    }
  }

  render() {
    const { isDropdownOpen, closeDropdown, isDragging } = this.props
    const dropdownProps = { closeDropdown, setOptionField: this.setOptionField }
    const fieldProps = _.extend({getField: this.props.getField}, this.props.fieldActionCreators)
    const { previewTableType, optionField } = this.state
    return div({className: "pane shelf-pane"},
               <FieldOptionsDropdown
               isOpen={isDropdownOpen && !isDragging}
               field={optionField && this.props.queryspec[optionField.shelf][optionField.position]}
               {...optionField} {...fieldProps} close={dropdownProps.closeDropdown} />,
               <TableSelect active={this.props.table.type} {...this.props.vizActionCreators} setPreview={this.setPreview} />,
               <TableSettings {...this.props} preview={previewTableType} dropdownProps={dropdownProps} />)
  }
}
ShelfPane = createDropdownComponent(ShelfPane)

export { ShelfPane }
