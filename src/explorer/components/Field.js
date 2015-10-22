import _ from 'lodash'
import className from 'classnames'
import React from 'react'
import ReactDOM from 'react-dom'
import { DragSource, DropTarget } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import { getFieldFunctionDisplayName, getFieldFunctionSelectDisplayName } from '../helpers/field'
import { FieldIcon } from './FieldIcon'

const {div, i: icon, span} = React.DOM
const { findDOMNode } = ReactDOM

/* Drop Handlers */

function calculateContainerBounds(shelf) {
  const shelfBounds = findDOMNode(shelf).getBoundingClientRect()
  const fieldBounds = shelf.props.fields.map((field, i) => findDOMNode(shelf.refs[`field:${i}`]).getBoundingClientRect())
  return { shelfBounds, fieldBounds }
}

export function calculateDropMarkPosition(shelf, dropOffset) {
  const { shelfBounds, fieldBounds } = calculateContainerBounds(shelf)
  const rawLeftEdge = dropOffset.x - shelfBounds.left
  const indexOfFieldAfterMark = _(fieldBounds).map((bounds) => bounds.left - shelfBounds.left).sortedIndex(rawLeftEdge)
  const markPosition = (indexOfFieldAfterMark >= fieldBounds.length ? _.last(fieldBounds).left + _.last(fieldBounds).width + 6 : fieldBounds[indexOfFieldAfterMark].left) - shelfBounds.left
  return markPosition
}

export function calculateDropPosition(shelf, dropOffset) {
  const { shelfBounds, fieldBounds } = calculateContainerBounds(shelf)
  const rawLeftEdge = dropOffset.x - shelfBounds.left
  const indexOfFieldAfterMark = _(fieldBounds).map((bounds) => bounds.left - shelfBounds.left).sortedIndex(rawLeftEdge)
  return indexOfFieldAfterMark
}

export const FieldDropHandler = {
  canDrop: props => true,

  hover(props, monitor, component) {
    component.setState({hoverDropOffset: monitor.getSourceClientOffset()})
  },

  drop(props, monitor, component) {
    const { shelf, position, dropField } = monitor.getItem()
    const actions = _.pick(props, 'insertFieldAtPosition', 'moveFieldTo', 'removeField', 'replaceFieldOnShelf', 'moveAndReplaceField')
    const newshelf = props.shelf
    let newposition = calculateDropPosition(component, monitor.getSourceClientOffset())
    if (shelf == newshelf && position != null && (position == newposition || position + 1 == newposition)) {
      newposition = position
    }

    return _.extend(actions, {shelf, position, newshelf, newposition, dropField})
  }
}

export function fieldDropCollector(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver({shallow: true}),
    canDrop: monitor.canDrop(),
    dropOffset: monitor.getSourceClientOffset()
  }
}

/* Drag Handlers */

function fieldDragCollector(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  }
}

const FieldDragHandler = {
  beginDrag: function(props, monitor, component) {
    let dropField
    if (props.tableId != null) {
      dropField = { tableId: props.tableId, fieldId: props.__id__ }
    }
    else if (props.field) {
      dropField = props.field
    }
    else {
      dropField = _.pick(props, 'id', 'name', 'type', 'op')
    }
    return { ...props, dropField }
  },

  endDrag: function(props, monitor, component) {
    if (!monitor.didDrop()) return
    const dragSourceName = component.constructor.displayName
    const [isTableField, isShelfField] = [dragSourceName == 'TableField', dragSourceName == 'ShelfField']
    const { removeField, replaceFieldOnShelf, insertFieldAtPosition,
            moveFieldTo, moveAndReplaceField,
            shelf, position, dropField,
            newshelf, newposition,
            droppedOnBody
          } = monitor.getDropResult()
    const isMovedToRowOrColShelf = _.contains(['row','col'], newshelf)
    if (isTableField) {
      if(isMovedToRowOrColShelf) {
        insertFieldAtPosition(newshelf, newposition, dropField)
      } else {
        replaceFieldOnShelf(newshelf, dropField)
      }
    }
    else if (isShelfField) {
      if (droppedOnBody) {
        removeField(shelf, position)
      }
      else if (isMovedToRowOrColShelf)
      {
        moveFieldTo(shelf, position, newshelf, newposition)
      }
      else {
        moveAndReplaceField(shelf, position, newshelf)
      }
    }
  }
}

/* Field Components */

class TableField extends React.Component {
  componentDidMount() {
    this.props.connectDragPreview(getEmptyImage(), {
      captureDraggingState: true
    })
  }

  render() {
    const { connectDragSource } = this.props
    return connectDragSource(
      div({className: "field-wrap datasource-table-field", onClick: this.props.onClick},
          div({className: "icon-wrap"}, <FieldIcon type={this.props.type}/>),
          div({className: "name-wrap"}, this.props.name)))
  }
}
TableField.displayName = 'TableField'
TableField = DragSource("TableField", FieldDragHandler, fieldDragCollector)(TableField)

class ShelfField extends React.Component {
  componentDidMount() {
    this.props.connectDragPreview(getEmptyImage(), {
      captureDraggingState: true
    })
  }

  handleOptionClick(evt) {
    evt.stopPropagation()
    const node = findDOMNode(this)
    this.props.setOptionField(this.props.shelf, this.props.position, node.getBoundingClientRect())
  }

  render() {
    const { name, type, remove, isDragging, connectDragSource } = this.props
    const { typecast, func } = this.props.field
    return connectDragSource(
      div({className: "field-wrap querybuilder-field", style: { opacity: isDragging ? 0.3 : 1 } },
          div({className: "icon-wrap"}, <FieldIcon type={type} typecast={typecast} />),
          div({className: "func-wrap"}, getFieldFunctionDisplayName(func)),
          div({className: className("name-wrap", {"has-func": func != null})}, name),
          div({className: "option-wrap", onClick: type == 'aggregate' ? (() => remove()) : this.handleOptionClick.bind(this) },
              type == 'aggregate' ? icon({className: "fa fa-times remove-link"}) : icon({className: "fa fa-caret-down"}))))
  }
}
ShelfField.displayName = 'ShelfField'
ShelfField = DragSource("ShelfField", FieldDragHandler, fieldDragCollector)(ShelfField)

export { TableField, ShelfField }
