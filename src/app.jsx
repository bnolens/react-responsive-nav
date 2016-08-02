import React from 'react'
import ReactDOM from 'react-dom'
import Nav from './nav.jsx'

import './styles.scss'

const $console = document.getElementById('console')

ReactDOM.render(
  <Nav logo="ReactNav"

       onClick={button => {
         $console.innerHTML += button.target.id + "\n"
       }}

       onSearch={value => {
         $console.innerHTML += value + "\n"
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
