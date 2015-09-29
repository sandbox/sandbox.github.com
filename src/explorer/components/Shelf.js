import className from 'classnames'
import React from 'react'
import { DropTarget } from 'react-dnd'
import _ from 'lodash'
import { VisualPropertiesDropdown } from './VisualPropertiesDropdown'
import { FieldOptionsDropdown } from './FieldDropdown'
import { createDropdownComponent } from '../../components/Dropdown'
import { ShelfField, calculateDropMarkPosition, calculateDropPosition, FieldDropHandler, fieldDropCollector } from './Field'

const { div, i: icon, a: link, pre } = React.DOM
const { findDOMNode } = React

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

class ShelfLegend extends React.Component {
  render() {
    return div({className: "querybuilder-shelf-legend"}, JSON.stringify(this.props.legend, null, 2))
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
    const optionComponent =
          isRowColShelf ? icon({className: 'fa fa-times remove-link', onClick: () => {
            dropdownProps.closeDropdown()
            clearFields(shelf)}}) : icon({className: 'fa fa-caret-down'})
    return div({className: "querybuilder-shelf"},
               <label onClick={isRowColShelf ? null : () => {
                 if (dropdownProps.isDropdownOpen) {
                   this.props.openDropdown()
                 } else {
                   this.props.toggleDropdown()
                 }
                 dropdownProps.closeDropdown()
               }} style={{cursor: isRowColShelf ? null : 'pointer'}}>{name}{optionComponent}</label>,
               <VisualPropertiesDropdown {...visualSettingsProps} />,
               <FieldContainer {...containerProps} />,
               !isRowColShelf && legend ? <ShelfLegend legend={legend} /> : null)
  }
}
Shelf = createDropdownComponent(Shelf)

export { Shelf }
