import React from 'react'

class Nav extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      menuExpanded: false,
      searchExpanded: false,
      menu: this.menuFromProps(props)
    }
    this.blurTimeout = 0
    this.searchTimeout = 0
    this.collapseIfExpanded = this.collapseIfExpanded.bind(this)
    this.expandDropdown = this.expandDropdown.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
    this.handleChildFocus = this.handleChildFocus.bind(this)
    this.toggleMenu = this.toggleMenu.bind(this)
    this.toggleSearch = this.toggleSearch.bind(this)
    this.searchThrottle = this.searchThrottle.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState(Object.assign({}, this.state, {
      menu: this.menuFromProps(nextProps)
    }))
  }

  menuFromProps(props) {
    return (props.menu || []).map(group => {
      let g = Object.assign({}, group, {
        focus: false
      });
      if (g.items) {
        g.items = group.items.map(item => {
          let i = Object.assign({}, item, {
            focus: false
          })
          return i;
        })
      }
      return g;
    })
  }

  collapseIfExpanded(dropButton) {
    clearTimeout(this.blurTimeout)
    this.state.menu.map(group => {
      if (dropButton.target.id !== group.id) { return; }
      if (group.focus) {
        setTimeout(function() { document.activeElement.blur() }, 0)
      }
    })
  }

  expandDropdown(dropButton) {
    clearTimeout(this.blurTimeout)
    const menu = this.state.menu.map(function(group) {
      return Object.assign({}, group, {
        focus: group.id === dropButton.target.id ? true : false,
        items: group.items.map(function(item) {
          return Object.assign({}, item, {focus: false});
        })
      });
    })
    this.setState({menu:menu})
  }

  handleBlur() {
    this.blurTimeout = setTimeout(function() {
      const menu = this.state.menu.map(group => {
        group.focus = false
        group.items = group.items.map(item => {
          item.focus = false
          return item;
        })
        return group;
      })
      this.setState({menu:menu})
    }.bind(this), 0)
  }

  handleChildFocus(button) {
    clearTimeout(this.blurTimeout)
    var menu = this.state.menu.map(function(group) {
      group.items = group.items.map(function(item) {
          if (button.target.id !== item.id) {
            return item;
          }
          group.focus = true
          return item;
      })
      return group;
    })
  }

  toggleMenu() {
    var state = this.state
    state.menuExpanded = this.state.menuExpanded ? false : true
    state.searchExpanded = false
    this.setState(state)
  }

  toggleSearch() {
    var state = this.state
    state.searchExpanded = this.state.searchExpanded ? false : true
    state.menuExpanded = false
    this.setState(state)
  }

  searchThrottle(e) {
    clearTimeout(this.searchTimeout)
    e.persist()
    this.searchTimeout = setTimeout(function() {
      this.props.onSearch(e)
    }.bind(this), 300)
  }

  render() {
    const menuExpanded = this.state.menuExpanded ? "expanded" : ""
    const searchExpanded = this.state.searchExpanded ? "expanded" : ""
    const handlers = {
      onFocus: this.expandDropdown,
      onBlur: this.handleBlur,
      onMouseDown: this.collapseIfExpanded
    }
    const childHandlers = {
      onBlur: this.handleBlur,
      onClick: this.props.onClick,
      onFocus: this.handleChildFocus
    }

    return (
      <nav>
        <div className="inner">
        <div id="mobile-menu-expand"
             className={menuExpanded}
             onClick={this.toggleMenu}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
        <a id="logo" onClick={this.props.onClick}>{this.props.logo}</a>
        <div id="search-expand-mobile"
             className={searchExpanded}
             onClick={this.toggleSearch}>
          <div className="icon"></div>
        </div>
        <DropButtonList
          dropButtons={this.state.menu}
          handlers={handlers}
          childHandlers={childHandlers}
          menuExpanded={menuExpanded} />
        <div id="search" className={searchExpanded}>
          <input type="text" placeholder="Search..." onChange={this.searchThrottle}/>
        </div>
        </div>
      </nav>
    )
  }
}

const DropButtonList = ({ dropButtons, handlers, childHandlers, menuExpanded }) => (
  <div id="nav-links" className={menuExpanded}>
    {dropButtons.map(dropButton => (
      <DropButton
          key={dropButton.id}
          dropButton={dropButton}
          handlers={handlers}
          childHandlers={childHandlers}>
      </DropButton>
    ))}
  </div>
)

const DropButton = ({ dropButton, handlers, childHandlers }) => {
  const dropProps = ['id', 'label', 'href'].reduce((memo, k) => {
    memo[k] = dropButton[k]
    return memo;
  }, {})
  const className = dropButton.focus ? 'dropdownContainer expanded' : 'dropdownContainer'
  return (
    <span className={className}>
      <a className="button dropdown" tabIndex={0} {...dropProps} {...handlers}>
        {dropButton.label} &#9660;
      </a>
      <div className="sublinks">
        {dropButton.items.map(button => (
          <Button key={button.id} {...button} {...childHandlers} />
        ))}
      </div>
    </span>
  )
}

const Button = ({id, href, label, onFocus, onBlur, onClick}) => (
    <a id={id}
       href={href}
       tabIndex={0}
       className="button"
       onFocus={onFocus}
       onBlur={onBlur}
       onClick={(button) => { onBlur(button); onClick(button); }}>{label}</a>
)

module.exports = Nav
