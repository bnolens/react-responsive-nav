import React from 'react'
import ReactDOM from 'react-dom'
import Nav from '../nav.jsx'
import renderer from 'react/lib/ReactTestRenderer'

console.error = jest.genMockFn()

describe('Nav', () => {

  it('displays nav links when mobileMenuExpand is clicked', () => {
    const component = renderer.create(
      <Nav onClick={(button) => { return; }}
           onSearch={(event) => { return; }}
           menu={[
            {id:"settings", label:"Settings", items:[
              {id:"logout", label:"Logout", href:"#"}
            ]}
      ]}></Nav>
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()

    const mobileMenuExpand = tree.children[0].children[0]
    mobileMenuExpand.props.onClick()

    tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('displays the search box and closes the nav links when mobileMenuExpand is clicked', () => {
    const component = renderer.create(
      <Nav onClick={(button) => { return; }}
           onSearch={(event) => { return; }}
           menu={[
            {id:"settings", label:"Settings", items:[
              {id:"logout", label:"Logout", href:"#"}
            ]}
      ]}></Nav>
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()

    const mobileSearchExpand = tree.children[0].children[2]
    mobileSearchExpand.props.onClick()

    tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
