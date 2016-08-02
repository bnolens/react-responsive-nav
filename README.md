# React Responsive Nav
A response navigation React component.

## Usage
Include 'nav.jsx' in your react app.

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

       onSearch={value => {
         console.log(value)
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
- To test, run `npm test` for a single test or `npm test -- --watch=all` for continuous testing.
- From the root directory run `npm run build -- --watch` and everything in `src` will be continuously compiled into the `bin` directory.
- Serve `index.html` from the examples directory. (e.g. with `python -m SimpleHTTPServer`)
- The `bin` directory is sym-linked to the `example/assets` directory.
