import className from 'classnames'
import React from 'react'
import _ from 'lodash'
import { DropTarget } from 'react-dnd'
import { FieldOptionsDropdown } from './FieldDropdown'
import { createDropdownComponent } from '../../components/Dropdown'
import { Shelf } from './Shelf'

const { div, i: icon, label, pre, a: link, input } = React.DOM
const { findDOMNode } = React

function createFieldDropdownComponent(Component) {
  class FieldDropdownContainer extends React.Component {
    constructor(props) {
      super(props)
      this.state = { optionField: null }
      this.setOptionField = this.setOptionField.bind(this)
      this.clearOptionField = this.clearOptionField.bind(this)
    }

    componentWillReceiveProps(nextProps) {
      if (!nextProps.isDropdownOpen) {
        this.setState({ optionField: null })
      } else if (nextProps.isDragging) {
        this.props.closeDropdown()
        this.setState({ optionField: null })
      }
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

    clearOptionField() {
      this.props.closeDropdown()
      this.setState({ optionField: null })
    }

    render() {
      return <Component {...this.props} {...this.state} setOptionField={this.setOptionField} clearOptionField={this.clearOptionField} />
    }
  }

  return createDropdownComponent(FieldDropdownContainer)
}

class TableLayoutSpecBuilder extends React.Component {
  render() {
    const { queryspec, fieldActionCreators,
            isDropdownOpen, closeDropdown, isDragging,
            optionField, setOptionField } = this.props
    const { row, col } = queryspec
    const dropdownProps = { closeDropdown, setOptionField }
    const fieldProps = _.extend({ getField: this.props.getField }, fieldActionCreators )
    return div({className: "querybuilder-type-spec col"},
               <FieldOptionsDropdown isOpen={isDropdownOpen && !isDragging}
               field={optionField && queryspec[optionField.shelf][optionField.position]}
               {...optionField} {...fieldProps} close={closeDropdown} />,
               <Shelf name="Rows" shelf="row" fields={row} {...fieldProps} dropdownProps={dropdownProps} />,
               <Shelf name="Columns" shelf="col" fields={col} {...fieldProps} dropdownProps={dropdownProps} />)
  }
}
TableLayoutSpecBuilder = createFieldDropdownComponent(TableLayoutSpecBuilder)

const TABLE_ENCODINGS = {
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

const ENCODING_MARK_PROPERTIES = {
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

const MARK_PROPERTY_NAME = {
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

class TableSelect extends React.Component {
  render() {
    const { active, setPreview, setTableEncoding } = this.props
    const shelfActions = { setPreview, setTableEncoding }
    return div({className: "tablebuilder-type-select"},
               _.map(
                 TABLE_ENCODINGS,
                 (args, encoding) =>
                   div(
                     {
                       key: encoding,
                       onMouseEnter: (evt) => setPreview(encoding),
                       onMouseLeave: (evt) => setPreview(null),
                       onClick: (evt) => setTableEncoding(encoding),
                       className: className("tablebuilder-type-choice", {active: active == encoding})
                     },
                     link({}, icon(...args)))))
  }
}

class TableVisualSpecBuilder extends React.Component {
  constructor() {
    super(...arguments)
    this.state = { previewTableType: null }
    this.setPreview = this.setPreview.bind(this)
  }

  setPreview(value) {
    this.setState({ previewTableType: value })
    this.props.clearOptionField()
  }

  render() {
    const {
      queryspec, fieldActionCreators,
      isDropdownOpen, closeDropdown, isDragging,
      optionField, setOptionField
    } = this.props
    const dropdownProps = { closeDropdown, setOptionField }
    const fieldProps = _.extend({ getField: this.props.getField }, fieldActionCreators )
    const { previewTableType } = this.state
    const markProperties = ENCODING_MARK_PROPERTIES[previewTableType || this.props.table.type]
    return div({className: "pane shelf-pane"},
               <FieldOptionsDropdown isOpen={isDropdownOpen && !isDragging}
               field={optionField && queryspec[optionField.shelf][optionField.position]}
               {...optionField} {...fieldProps} close={closeDropdown} />,
               <TableSelect active={this.props.table.type} {...this.props.vizActionCreators} setPreview={this.setPreview} />,
               div({className: "container-flex-fill-wrap"},
                   div({className: "container-flex-fill"},
                       markProperties.map((attr) => {
                         return <Shelf key={attr} name={MARK_PROPERTY_NAME[attr]} shelf={attr} fields={queryspec[attr]} {...fieldProps} dropdownProps={dropdownProps} />
                       }))))
  }
}
TableVisualSpecBuilder = createFieldDropdownComponent(TableVisualSpecBuilder)

export { TableLayoutSpecBuilder, TableVisualSpecBuilder }
