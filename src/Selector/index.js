import React from 'react';
import NetProvider from '../NetProvider'
export default class Selector extends React.PureComponent {
  render() {
    return <NetProvider {...this.props} selectorComponent clearOnUnMount={false}/>
  }
};
