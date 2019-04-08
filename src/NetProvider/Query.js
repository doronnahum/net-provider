import React, { Component } from 'react';
import NetProvider from './index';

class Query extends Component {
  render() {
    return (
      <NetProvider {...this.props} loadData={this.props.query}/>
    );
  }
}

export default Query;
