import React from 'react'
import {Mixin as tweenMixin} from 'react-tween-state'

function animateMark(Component, transitionAttributes) {
  const VisualMark = React.createClass({
    mixins: [tweenMixin],
    getInitialState() {
      let state = {}
      transitionAttributes.forEach(
        transition =>
          state[transition.prop] = transition.start == null ? 0 : transition.start)
      return state
    },
    componentDidMount() {
      transitionAttributes.forEach(
        transition =>
          this.tweenState(transition.prop, {
            easing: transition.ease,
            duration: transition.duration,
            endValue: this.props[transition.prop]
          }))
    },
    render() {
      let props = {}
      transitionAttributes.forEach(
        transition => props[transition.prop] = this.getTweeningValue(transition.prop))
      return <Component {...this.props} {...props} />
    }
  })

  return VisualMark
}

export default animateMark
