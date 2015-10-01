import React from 'react'
import className from 'classnames'
import _ from 'lodash'
const {div, i: icon, label, pre, a: link, input} = React.DOM
import { getFieldFunctionSelectDisplayName, getExternalType } from '../helpers/field'
import { FieldIcon } from './FieldIcon'

class FieldRadioGroupOptions extends React.Component {
  render() {
    const { choice, options, onChoiceChange } = this.props
    return div({className: "querybuilder-field-settings-options"},
               options.map((value) => {
                 return div({key: value,
                             className: "querybuilder-field-settings-option-value",
                             style: { width: value == "bin" ? "100%" : null }},
                            label({},
                                  input({
                                    key: value,
                                    type: 'radio',
                                    value: value,
                                    checked: value === choice,
                                    onChange: () => { if (value !== choice) onChoiceChange(value) }
                                  }),
                                  getFieldFunctionSelectDisplayName(value)))
               }))
  }
}

class TypeFunctions extends React.Component {
  render() {
    const { func, type, updateFieldFunction } = this.props
    if (type == 'number') {
      return div({className: "querybuilder-field-options querybuilder-func"},
                 label({},
                       "Functions",
                       func ? link({onClick: () => updateFieldFunction(null)}, "Reset") : null),
                 <FieldRadioGroupOptions name="func" choice={func}
                 options={["bin",
                           "count", "sum",
                           "mean", "median",
                           "min", "max"]}
                 onChoiceChange={updateFieldFunction} />)
    }
    else if (type == 'time') {
      return div({className: "querybuilder-field-options querybuilder-func"},
                 label({}, "Function",
                       func && !_.contains(func, "bin") ? link({onClick: () => updateFieldFunction(null)}, "Reset") : null),
                 <FieldRadioGroupOptions name="func" choice={func}
                 options={[
                   "year", "month", "day", "date", "hour", "minute", "second"
                 ]}
                 onChoiceChange={updateFieldFunction} />,
                 label({}, "BIN",
                       func && _.contains(func, 'bin') ? link({onClick: () => updateFieldFunction(null)}, "Reset") : null),
                 <FieldRadioGroupOptions name="func" choice={func}
                 options={[
                   "bin[ms]", "bin[s]", "bin[m]", "bin[h]", "bin[d]", "bin[w]", "bin[M]", "bin[Q]", "bin[6M]", "bin[Y]", "bin[5Y]", "bin[10Y]"
                 ]}
                 onChoiceChange={updateFieldFunction} />)
    }
    else {
      return null
    }
  }
}

class GenericFieldOptions extends React.Component {
  render() {
    const { func, type, typecast, typeOptions, updateFieldTypecast, updateFieldFunction } = this.props
    const internalExternalType = getExternalType(type)
    const finalType = typecast || internalExternalType
    return div({className: "querybuilder-field-options"},
               label({}, "Type"),
               <FieldRadioGroupOptions name="typecast" choice={finalType} options={typeOptions} onChoiceChange={(value) => updateFieldTypecast(value === internalExternalType ? null : value)} />,
               <TypeFunctions type={finalType} func={func} updateFieldFunction={updateFieldFunction} />)
  }
}

class FieldOptions extends React.Component {
  render() {
    const { field, fieldSettings, updateFieldTypecast, updateFieldFunction } = this.props
    const { type: fieldType } = fieldSettings
    const typecastOptions = {
      type: fieldType,
      typecast: field.typecast,
      func: field.func,
      updateFieldTypecast: updateFieldTypecast,
      updateFieldFunction: updateFieldFunction
    }

    if (['date', 'timestamp', 'time'].indexOf(fieldType) >= 0) {
      return <GenericFieldOptions {...typecastOptions} typeOptions={['time', 'number', 'text']} />
    } else if (["string", 'text'].indexOf(fieldType) >= 0) {
      return <GenericFieldOptions {...typecastOptions} typeOptions={['text', 'number']} />
    } else if (['integer', 'number'].indexOf(fieldType) >= 0) {
      return <GenericFieldOptions {...typecastOptions} typeOptions={['number', 'text']} />
    } else {
      return div({className: "querybuilder-field-options"}, label({}, "No Settings"))
    }
  }
}

export class FieldOptionsDropdown extends React.Component {
  render() {
    const { isOpen, shelf, field, position, top, left, removeField, updateFieldTypecast, updateFieldFunction } = this.props
    if (!isOpen) return null
    const fieldSettings = this.props.getField(field.tableId, field.fieldId)
    return div({className: "querybuilder-field-settings", style: {top, left}},
               icon({className: "fa fa-times remove-link", onClick: this.props.close}),
               <FieldOptions position={position} field={field} fieldSettings={fieldSettings}
               updateFieldFunction={_.curry(updateFieldFunction, 3)(shelf, position)}
               updateFieldTypecast={_.curry(updateFieldTypecast, 3)(shelf, position)} />,
               div({className: "querybuilder-field-remove", onClick: () => {
                 this.props.close()
                 removeField(shelf, position)
               }}, "Remove"))
  }
}
