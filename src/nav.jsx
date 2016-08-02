import React from 'react'

class Store {
  constructor() {
    this.listeners = []
  }

  subscribe(listener) {
    this.listeners.push(listener)
    return () => {
      const i = this.listeners.indexOf(listener)
      if (i !== -1) { this.listeners.splice(i, 1) }
    }
  }

  dispatch(body) {
    this.listeners.map((listener) => {
      listener(body)
    })
  }
}

const store = new Store()

export default class Nav extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      menuExpanded: false,
      searchExpanded: false,
      menu: this.menuFromProps(props)
    }
    this.blurTimeout = 0
    this.searchTimeout = 0
    this.store = props.store || store
    this.update = this.update.bind(this)
  }

  componentWillMount() {
    this.unsubscribe = store.subscribe(this.update.bind(this))
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  update(action) {
    this.setState(navReducer.call(this, action))
  }

  componentWillReceiveProps(nextProps) {
    this.setState(Object.assign({}, this.state, {
      menu: this.menuFromProps(nextProps)
    }))
  }

  menuFromProps(props) {
    return (props.menu || []).map(group => {
      return Object.assign({}, group, {
        expanded: group.expanded || false
      })
    })
  }

  render() {
    const menuExpanded = this.state.menuExpanded ? "expanded" : ""
    const searchExpanded = this.state.searchExpanded ? "expanded" : ""

    return (
      <nav>
        <div className="inner">
        <div id="mobile-menu-expand"
             className={menuExpanded}
             onClick={toggleMenuAction}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
        <a id="logo" key="logo" onClick={clickButtonAction}>{this.props.logo}</a>
        <div id="search-expand-mobile"
             className={searchExpanded}
             onClick={toggleSearchAction}>
          <div className="icon"></div>
        </div>
        <DropButtonList
          dropButtons={this.state.menu}
          menuExpanded={menuExpanded} />
        <div id="search" className={searchExpanded}>
          <input id="search-input" type="text" placeholder="Search..." onChange={searchChange}/>
        </div>
        </div>
      </nav>
    )
  }
}

const navReducer = function(action) {
  const {state, props} = this
  switch(action.action) {
    case 'TOGGLE_MENU':
      return Object.assign({}, state, {
        menuExpanded: !state.menuExpanded,
        searchExpanded: false
      });
    case 'TOGGLE_SEARCH':
      return Object.assign({}, state, {
        menuExpanded: false,
        searchExpanded: !state.searchExpanded
      });
    case 'HANDLE_BLUR':
      console.log("handle blur")
      return Object.assign({}, state, {
        menu: state.menu.map((group) => {
          return Object.assign({}, group, {
            expanded: false
          })
        })
      });
    case 'FOCUS_BUTTON':
      return Object.assign({}, state, {
        menu: state.menu.map((group) => {
          return Object.assign({}, group, {
            expanded: (group.items||[]).map((item) => {
              return item.id === action.button.target.id
            }).indexOf(true) > -1 ? true : false
          })
        })
      });
    case 'FOCUS_DROPDOWN':
      return Object.assign({}, state, {
        menu: state.menu.map((group) => {
          return Object.assign({}, group, {
            expanded: group.id === action.dropdown.target.id
          })
        })
      });
    case 'CLICK_BUTTON':
      props.onClick(action.button)
      return state;
    case 'COLLAPSE_DROPDOWN_IF_EXPANDED':
      return Object.assign({}, state, {
        menu: state.menu.map((group) => {
          if (action.dropdown.target.id !== group.id || !group.expanded) { return group; }
          setTimeout(() => { document.activeElement.blur() }, 100)
          return Object.assign({}, group, {
            expanded: false
          })
        })
      })
    case 'SEARCH_CHANGE':
      props.onSearch(action.value)
      return state;
  }
  return state;
}

const DropButtonList = ({ dropButtons, menuExpanded }) => (
  <div id="nav-links" className={menuExpanded}>
    {dropButtons.map(dropButton => (
      <DropButton
          key={dropButton.id}
          dropButton={dropButton}>
      </DropButton>
    ))}
  </div>
)

const DropButton = ({ dropButton }) => {
  let id, label, href
  const dropButtonProps = ({id, label, href} = dropButton, {id, label, href})
  const className = dropButton.expanded ? 'dropdownContainer expanded' : 'dropdownContainer'
  return (
    <span className={className}>
      <a className="button dropdown" tabIndex={0} {...dropButtonProps}
          onMouseDown={collapseDropdownIfExpanded}
          onFocus={focusDropdownAction}
          onBlur={blurAction}>
        {dropButton.label} &#9660;
      </a>
      <div className="sublinks">
        {dropButton.items.map(button => (
          <Button key={button.id} {...button} />
        ))}
      </div>
    </span>
  )
}

const Button = ({id, href, label}) => (
    <a id={id}
       href={href}
       tabIndex={0}
       className="button"
       onFocus={focusButtonAction}
       onBlur={blurAction}
       onClick={(button) => { blurAction(button); clickButtonAction(button); }}>{label}</a>
)

/***********/
/* actions */
/***********/

const toggleMenuAction = () => {
  store.dispatch({
    action: 'TOGGLE_MENU'
  })
}

const toggleSearchAction = () => {
  store.dispatch({
    action: 'TOGGLE_SEARCH'
  })
}

const focusButtonAction = (button) => {
  clearTimeout(blurTimeout)
  store.dispatch({
    action: 'FOCUS_BUTTON',
    button: button
  })
}

const focusDropdownAction = (dropdown) => {
  clearTimeout(blurTimeout)
  store.dispatch({
    action: 'FOCUS_DROPDOWN',
    dropdown: dropdown
  })
}

let blurTimeout = 0
const blurAction = () => {
  blurTimeout = setTimeout(() => {
    store.dispatch({
      action: 'HANDLE_BLUR'
    })
  }, 0)
}

const clickButtonAction = (button) => {
  store.dispatch({
    action: 'CLICK_BUTTON',
    button: button
  })
}

const collapseDropdownIfExpanded = (dropdown) => {
  clearTimeout(blurTimeout)
  store.dispatch({
    action: 'COLLAPSE_DROPDOWN_IF_EXPANDED',
    dropdown: dropdown
  })
}

let searchTimeout = 0
const searchChange = (event) => {
  clearTimeout(searchTimeout)
  event.persist()
  searchTimeout = setTimeout(() => {
    store.dispatch({
      action: 'SEARCH_CHANGE',
      value: event.target.value
    })
  }, 300)
}

/******************/
/* end of actions */
/******************/
