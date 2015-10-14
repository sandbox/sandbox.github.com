import className from 'classnames'
import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import { DropTarget } from 'react-dnd'
import { FieldOptionsDropdown } from './FieldDropdown'
import { createDropdownComponent } from '../../components/Dropdown'
import { Shelf as ShelfComponent } from './Shelf'
const Shelf = React.createFactory(ShelfComponent)

import { TABLE_ENCODINGS } from '../helpers/table'

const { div, i: icon, label, pre, a: link, input } = React.DOM
const { findDOMNode } = ReactDOM

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
        this.setState({ optionField: {
          shelf, position,
          top: bounds.bottom - container.top - 1,
          left: bounds.left - container.left
        }})
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
            optionField, setOptionField, getField } = this.props
    const { row, col } = queryspec
    const dropdownProps = { closeDropdown, setOptionField }
    const fieldProps = _.extend({ getField }, fieldActionCreators )
    return div({className: "querybuilder-type-spec col"},
               <FieldOptionsDropdown isOpen={isDropdownOpen && !isDragging}
               field={optionField && queryspec[optionField.shelf][optionField.position]}
               {...optionField} {...fieldProps} close={closeDropdown} />,
               Shelf({name: "Rows", shelf: "row", fields: row, ...fieldProps, dropdownProps: dropdownProps}),
               Shelf({name: "Columns", shelf: "col", fields: col, ...fieldProps, dropdownProps: dropdownProps}))
  }
}
TableLayoutSpecBuilder = createFieldDropdownComponent(TableLayoutSpecBuilder)

const MARK_PROPERTY_NAME = {
  size:        "Size",
  shape:       "Shape",
  color:       "Color",
  background:  "Background",
  opacity:     "Opacity",
  orientation: "Orientation",
  x:           "X Start",
  x2:          "X End",
  y:           "Y Start",
  y2:          "Y End",
  text:        "Text"
}

class TableSelect extends React.Component {
  render() {
    const { active, setPreview, setTableEncoding } = this.props
    const shelfActions = { setPreview, setTableEncoding }
    return div({className: "tablebuilder-type-select"},
               _.map(
                 TABLE_ENCODINGS,
                 (encoding, name) =>
                   div(
                     {
                       key: name,
                       onMouseEnter: (evt) => setPreview(name),
                       onMouseLeave: (evt) => setPreview(null),
                       onClick: (evt) => setTableEncoding(name),
                       className: className("tablebuilder-type-choice", {active: active == name})
                     },
                     link({}, icon(...encoding.icon)))))
  }
}

class TableVisualSpecBuilder extends React.Component {
  constructor() {
    super(...arguments)
    this.state = { previewTableType: null, visualOptionDropdown: null }
    this.setPreview = this.setPreview.bind(this)
  }

  setPreview(value) {
    this.setState({ previewTableType: value })
    this.props.clearOptionField()
  }

  render() {
    const {
      queryspec, fieldActionCreators, vizActionCreators, scales,
      isDropdownOpen, closeDropdown, isDragging,
      optionField, setOptionField, getField
    } = this.props
    const dropdownProps = { isDropdownOpen, closeDropdown, setOptionField }
    const fieldProps = _.extend({ getField }, fieldActionCreators )
    const { previewTableType } = this.state
    const markProperties = TABLE_ENCODINGS[previewTableType || this.props.table.type].properties
    return div({className: "pane shelf-pane"},
               <FieldOptionsDropdown isOpen={isDropdownOpen && !isDragging}
               field={optionField && queryspec[optionField.shelf][optionField.position]}
               {...optionField} {...fieldProps} close={closeDropdown} />,
               <TableSelect active={this.props.table.type} {...this.props.vizActionCreators} setPreview={this.setPreview} />,
               div({className: "container-flex-fill-wrap"},
                   div({className: "container-flex-fill"},
                       <label className="tablebuilder-encoding-title">{TABLE_ENCODINGS[previewTableType || this.props.table.type].name}</label>,
                       markProperties.map((attr) => {
                         return Shelf({
                           key: attr,
                           name: MARK_PROPERTY_NAME[attr],
                           shelf: attr,
                           properties: this.props.properties[attr],
                           fields: queryspec[attr],
                           dropdownProps: dropdownProps,
                           vizActionCreators: vizActionCreators,
                           legend: scales && scales[attr],
                             ...fieldProps
                         })
                       }))))
  }
}
TableVisualSpecBuilder = createFieldDropdownComponent(TableVisualSpecBuilder)

export { TableLayoutSpecBuilder, TableVisualSpecBuilder }
