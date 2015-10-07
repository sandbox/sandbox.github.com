import React from 'react'
import ReactDOM from 'react-dom'
const { findDOMNode } = ReactDOM

function contains(parent, child) {
  var node = child.parentNode
  while (node != null) {
    if (node == parent) {
      return true
    }
    node = node.parentNode
  }
  return false
}

export function handleOuterClick(Component) {
  class ClickHandler extends React.Component {
    constructor(props) {
      super(props)
      this.bindOuterClickHandler   = this.bindOuterClickHandler.bind(this)
      this.unbindOuterClickHandler = this.unbindOuterClickHandler.bind(this)
      this.handleDocumentClick = this.handleDocumentClick.bind(this)
    }

    handleDocumentClick(onOuterClick) {
      return (evt) => {
        let target = evt.target || evt.srcElement
        if (target.parentNode != null && !contains(findDOMNode(this), target)) {
          onOuterClick()
        }
      }
    }

    bindOuterClickHandler(onOuterClick) {
      window.addEventListener('click', onOuterClick)
    }

    unbindOuterClickHandler(onOuterClick) {
      window.removeEventListener('click', onOuterClick)
    }

    render() {
      return <Component {...this.props}
      handleDocumentClick={this.handleDocumentClick}
      bindOuterClickHandler={this.bindOuterClickHandler}
      unbindOuterClickHandler={this.unbindOuterClickHandler}/>
    }
  }

  return ClickHandler
}

export function createDropdownComponent(Component) {
  class Dropdown extends React.Component {
    constructor(props) {
      super(props)
      this.state = { open: false }
      this.openDropdown   = this.openDropdown.bind(this)
      this.closeDropdown  = this.closeDropdown.bind(this)
      this.toggleDropdown = this.toggleDropdown.bind(this)
      this.onOuterClick = this.props.handleDocumentClick(this.closeDropdown)
    }

    componentDidUpdate(prevProps, prevState) {
      if (this.state.open)
        this.props.bindOuterClickHandler(this.onOuterClick)
      else
        this.props.unbindOuterClickHandler(this.onOuterClick)
    }

    componentWillUnmount() {
      this.props.unbindOuterClickHandler(this.onOuterClick)
    }

    openDropdown() {
      this.setState({open: true})
    }

    closeDropdown() {
      this.setState({open: false})
    }

    toggleDropdown() {
      this.setState({open: !this.state.open})
    }

    render() {
      return <Component
      {...this.props}
      isDropdownOpen={this.state.open}
      toggleDropdown={this.toggleDropdown.bind(this)}
      openDropdown={this.openDropdown.bind(this)}
      closeDropdown={this.closeDropdown.bind(this)} />
    }
  }

  return handleOuterClick(Dropdown)
}
