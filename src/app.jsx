import React from 'react'
import ReactDOM from 'react-dom'
import Nav from './nav.jsx'

import './styles.scss'

ReactDOM.render(
  <Nav logo="ReactNav"

       onClick={button => {
         console.log(button.target.id)
       }}

       onSearch={event => {
         console.log(event.target.value)
       }}

       menu={[
        {id: "objects", label: "Objects", items: [
          {id: "widget", label: "Widget", href: "#"}
        ]},
        {id: "settings", label: "Settings", items: [
          {id: "account", label: "Account", href: "#"},
          {id: "logout", label: "Logout", href: "#"}
        ]}
       ]}
  />,
  document.getElementById('container')
)
