import className from 'classnames'
import React from 'react'
import _ from 'lodash'
import { DropTarget } from 'react-dnd'
import { FieldOptionsDropdown } from './FieldDropdown'
import { createDropdownComponent } from '../../components/Dropdown'
import { ShelfField, calculateDropMarkPosition, calculateDropPosition, FieldDropHandler, fieldDropCollector } from './Field'

const {div, i: icon, label, pre, a: link, input} = React.DOM
const { findDOMNode } = React

class FieldContainer extends React.Component {
  componentDidUpdate(prevProps, prevState) {
    if (this.hasDropMarker()) {
      findDOMNode(this.refs.dropMarker).style.left = `${calculateDropMarkPosition(this, this.state.hoverDropOffset)}px`
    }
  }

  hasDropMarker() {
    return this.props.fields.length > 0 && this.props.isOver && this.props.dropOffset
  }

  render() {
    const { shelf, fields, getField, removeField, dropdownProps } = this.props
    const { isOver, canDrop, dropOffset, connectDropTarget, itemType } = this.props
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
                                 "field-drop-over": isOver,
                                 "field-contained": !_.isEmpty(fields),
                                 "field-empty": _.isEmpty(fields),
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

class Shelf extends React.Component {
  render() {
    const { name, shelf, fields,
            removeField, getField, clearFields, moveFieldTo, insertFieldAtPosition,
            dropdownProps } = this.props
    const containerProps = { shelf, fields, removeField, moveFieldTo, insertFieldAtPosition, getField, dropdownProps }
    return div({className: "querybuilder-vis-table"},
               <label>{name}{icon({className: 'fa fa-times remove-link', onClick: () => {
                 dropdownProps.closeDropdown()
                 clearFields(shelf)}})}</label>,
               <FieldContainer {...containerProps} />)
  }
}

class TableVisualizerQueryBuilder extends React.Component {
  constructor(props) {
    super(props)
    this.state = { optionField: null }
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
    const { row, col,
            clearFields, removeField, updateFieldTypecast, updateFieldFunction, getField,
            insertFieldAtPosition, moveFieldTo,
            isDropdownOpen, closeDropdown,
            isDragging
          } = this.props
    const { optionField } = this.state
    const dropdownProps = { closeDropdown, setOptionField: this.setOptionField }
    const fieldProps = { clearFields, removeField, insertFieldAtPosition, moveFieldTo, getField, updateFieldTypecast, updateFieldFunction }
    return div({className: "querybuilder-type-spec col"},
               <FieldOptionsDropdown
               isOpen={isDropdownOpen && !isDragging}
               field={optionField && this.props[optionField.shelf][optionField.position]}
               {...optionField} {...fieldProps} close={dropdownProps.closeDropdown} />,
               <Shelf name="Rows" shelf="row" fields={row} {...fieldProps} dropdownProps={dropdownProps} />,
               <Shelf name="Columns" shelf="col" fields={col} {...fieldProps} dropdownProps={dropdownProps} />)
  }
}
TableVisualizerQueryBuilder = createDropdownComponent(TableVisualizerQueryBuilder)
export { TableVisualizerQueryBuilder }
