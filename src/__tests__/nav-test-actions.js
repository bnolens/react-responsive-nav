import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import Nav from '../nav.jsx';

console.error = jest.genMockFn()

const scryRenderedDOMComponentsWithId = (tree, id) => {
  return TestUtils.findAllInRenderedTree(tree, function(inst) {
    return TestUtils.isDOMComponent(inst) && inst.getAttribute('id') === id;
  });
}

describe('Nav', () => {
  let nav, clicked, searched
  beforeEach(() => {
    clicked = {}
    searched = {}
    nav = TestUtils.renderIntoDocument(
      <Nav onClick={(button) => { clicked[button.target.id] = true; }}
           onSearch={(value) => { searched[value] = true; }}
           menu={[
            {id:"settings", label:"Settings", items:[
              {id:"logout", label:"Logout", href:"#"}
            ]}
      ]}></Nav>
    )
  })

  it('calls the onClick handler when buttons are clicked', () => {
    TestUtils.Simulate.click(
      scryRenderedDOMComponentsWithId(nav, 'logo')[0],
      {target: {id: "logo"}
    })

    TestUtils.Simulate.click(
      scryRenderedDOMComponentsWithId(nav, 'logout')[0],
      {target: {id: "logout"}
    })

    expect(clicked['logo']).toEqual(true)
    expect(clicked['logout']).toEqual(true)
  })

  it('calls the onSearch handler when the search input has changed', () => {
    TestUtils.Simulate.change(
      scryRenderedDOMComponentsWithId(nav, 'search-input')[0],
      {target: { value: "foo" }}
    )

    jest.runAllTimers()

    expect(searched['foo']).toEqual(true)
  })

  it('mousedown collapses a dropdown if clicked when expanded', () => {

    nav = TestUtils.renderIntoDocument(
      <Nav onClick={(button) => { clicked[button.target.id] = true; }}
           onSearch={(value) => { searched[value] = true; }}
           menu={[
            {id:"settings", label:"Settings", expanded: true, items:[
              {id:"logout", label:"Logout", href:"#"}
            ]}
      ]}></Nav>
    )

    expect(nav.state.menu[0].expanded).toEqual(true)

    document.activeElement.blur = jest.genMockFn()

    TestUtils.Simulate.mouseDown(
      scryRenderedDOMComponentsWithId(nav, 'settings')[0],
      {target: { id: "settings" }}
    )

    jest.runAllTimers()

    expect(document.activeElement.blur.mock.calls.length).toBe(1);
    expect(nav.state.menu[0].expanded).toEqual(false)
  })

  it('mousedown does nothing to a dropdown if clicked when not expanded', () => {
    document.activeElement.blur = jest.genMockFn()

    TestUtils.Simulate.mouseDown(
      scryRenderedDOMComponentsWithId(nav, 'settings')[0],
      {target: { id: "settings" }}
    )

    jest.runAllTimers()

    expect(document.activeElement.blur.mock.calls.length).toBe(0);
    expect(nav.state.menu[0].expanded).toEqual(false)
  })
})
