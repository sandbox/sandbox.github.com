import React from 'react'
import _ from 'lodash'
import { getExternalType } from '../helpers/field'
const { div, i: icon, a: link, label, pre, input, select, option, img, span } = React.DOM
import { COLOR_PALETTES } from '../helpers/color'

class ColorRangeSettings extends React.Component {
  render() {
    const { property, settings, setPropertySetting } = this.props
    if (settings.scaleManualRange) {
      return div({},
                 label({className: 'querybuilder-color-sub-settings querybuilder-color-sub-settings-input'},
                       "Min:",
                       input({type: 'color', value: settings.scaleRangeMin, onChange: (evt) => {
                         setPropertySetting(property, 'scaleRangeMin', evt.target.value)
                       }})),
                 label({className: 'querybuilder-color-sub-settings querybuilder-color-sub-settings-input'},
                       "Max:",
                       input({type: 'color', value: settings.scaleRangeMax, onChange: (evt) => {
                         setPropertySetting(property, 'scaleRangeMax', evt.target.value)
                       }})))
    }
    else {
      return null
    }
  }
}

class ColorDomainSettings extends React.Component {
  render() {
    const { property, settings, setPropertySetting } = this.props
    if (settings.scaleManualDomain) {
      return div({},
                 label({className: 'querybuilder-color-sub-settings querybuilder-color-sub-settings-input'},
                       "Min:",
                       input({type: 'number', value: settings.scaleDomainMin, onChange: (evt) => {
                         setPropertySetting(property, 'scaleDomainMin', evt.target.value)
                       }})),
                 label({className: 'querybuilder-color-sub-settings querybuilder-color-sub-settings-input'},
                       "Max:",
                       input({type: 'number', value: settings.scaleDomainMax, onChange: (evt) => {
                         setPropertySetting(property, 'scaleDomainMax', evt.target.value)
                       }})))
    }
    else {
      return label({className: 'querybuilder-color-sub-settings'},
                   input({type: 'checkbox', checked: settings.scaleZero, onChange: (evt) => {
                     setPropertySetting(property, 'scaleZero', evt.target.checked)
                   }}),
                   "Zero?")
    }
  }
}

class ColorProperties extends React.Component {
  render() {
    const { property, fields, fieldTypes, settings, setPropertySetting } = this.props
    const hasField = !_.isEmpty(fields)
    const fieldType = hasField ? (fields[0].op != null ? "number" : getExternalType(fields[0].typecast || fieldTypes[0].type)) : null
    if (hasField) {
      switch (fieldType) {
      case 'text':
        return div({},
                   label({}, "Palette"),
                   div({className: 'querybuilder-color-settings'},
                       _.map(COLOR_PALETTES, (colors, value) => {
                         return label({key: value},
                                      input({
                                        type: 'radio',
                                        value: value,
                                        checked: value === settings.palette,
                                        onChange: () => { if (value !== settings.palette) setPropertySetting(property, 'palette', value) }
                                      }),
                                      div({ dangerouslySetInnerHTML: { __html: require(`../images/color/${value}.svg`) } }))
                       })))
      default:
        return div({},
                   label(
                     {className: 'querybuilder-color-static', style: {marginBottom: 5}},
                     span({style: {marginTop: 4}}, "Scale"),
                     select(
                       {
                         value: settings.scale,
                         onChange: (evt) => { setPropertySetting(property, 'scale', evt.target.value) }
                       },
                       option({value: "linear"}, "linear"),
                       option({value: "log"}, "log"),
                       option({value: "pow"}, "pow"),
                       option({value: "sqrt"}, "sqrt"),
                       option({value: "quantile"}, "quantile"))),
                   label({className: 'querybuilder-color-settings'},
                         input({type: 'checkbox', checked: !settings.scaleManualDomain, onChange: (evt) => {
                           setPropertySetting(property, 'scaleManualDomain', !evt.target.checked)
                         }}),
                         "Auto Domain"),
                   <ColorDomainSettings {...{property, settings, setPropertySetting}} />,
                   label({className: 'querybuilder-color-settings'},
                         input({type: 'checkbox', checked: !settings.scaleManualRange, onChange: (evt) => {
                           setPropertySetting(property, 'scaleManualRange', !evt.target.checked)
                         }}),
                         "Auto Range"),
                   <ColorRangeSettings {...{property, settings, setPropertySetting}} />)
      }
    }
    else {
      return label({className: 'querybuilder-color-static'},
                   "Default",
                   input({type: "color", value: settings['default'],
                          onChange: (evt) => { setPropertySetting(property, 'default', evt.target.value) }}))
    }
  }
}

class VisualPropertiesSettings extends React.Component {
  render() {
    const { property, fields, settings, getField, setPropertySetting } = this.props
    const fieldTypes = fields.map((field) => getField(field.tableId, field.fieldId))

    switch(property) {
    case 'color': case 'background':
      return <ColorProperties {...{property, fields, fieldTypes, settings, setPropertySetting}}/>
    default:
      return div(
        {},
        pre({}, JSON.stringify(fields, null, 2)),
        pre({}, JSON.stringify(fieldTypes, null, 2)),
        pre({}, JSON.stringify(settings, null, 2)))
    }
  }
}

export class VisualPropertiesDropdown extends React.Component {
  render() {
    const { isOpen, property, fields, settings, getField, close, setPropertySetting } = this.props
    if (!isOpen) return null
    return div({className: "querybuilder-field-settings querybuilder-property-settings"},
               icon({className: "fa fa-times remove-link", onClick: close}),
               <VisualPropertiesSettings {...{property, fields, settings, getField, setPropertySetting}} />)
  }
}
