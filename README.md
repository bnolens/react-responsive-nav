# React Responsive Nav
A response navigation React component.

## Dependencies
* React
* ReactDOM
* An ES2015/JSX transpiler (e.g. Babel)

## Development Dependencies
* webpack
* babel
* extract-text-webpack-plugin
* sass-loader

## Usage
The `Nav` component accepts four props.
- logo: Text or image that identifies the app.
- onClick: A callback that returns the button that was clicked.
- onSearch: A callback that fires when the search box value changes.
- menu: A JSON object that specifies how to populate the drop down buttons on the nav.

```
import React from 'react'
import ReactDOM from 'react-dom'
import Nav from ('./nav.jsx')

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
```

## Example
See the examples directory or [github pages](http://dannybtran.github.io/react-responsive-nav/)

## Build
- From the root directory run `webpack --watch` and everything in `src` will be compiled upon file change into the `bin` directory.
