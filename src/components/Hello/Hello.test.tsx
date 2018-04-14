import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as enzyme from 'enzyme';
import Hello from './Hello';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Hello name="louis"/>, div);
});

it('renders correct name without given username', () => {
  const hello = enzyme.shallow(<Hello />);
  expect(hello.find('.welcome').text()).toEqual('Hello, Anonymous!');
});
