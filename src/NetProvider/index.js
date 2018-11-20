import React, { createElement } from 'react';
// import PropTypes from 'prop-types';
import connect from '../connect'
// actions from connect SetParameters, Clean, Create, CreateLocal, Delete, DeleteLocal, Read, Refresh, Update, UpdateLocal
import isArray from 'lodash/isArray';

class NetProvider extends React.Component {
  constructor(props) {
    super(props);
    this.crudActions = {
      Read: this.Read.bind(this),
      Refresh: this.Refresh.bind(this),
      Create: this.Create.bind(this),
      Update: this.Update.bind(this),
      Delete: this.Delete.bind(this),
      SetParameters: this.SetParameters.bind(this),
      Clean: this.Clean.bind(this),
      CreateLocal: this.CreateLocal.bind(this),
      DeleteLocal: this.DeleteLocal.bind(this),
      UpdateLocal: this.UpdateLocal.bind(this),
    }
    this.sendRequest = this.sendRequest.bind(this);
  };

  componentDidMount () {
    const {loadData} = this.props
    if(loadData) {
      if(isArray(loadData)) loadData.forEach(req => this.sendRequest(req))
      else this.sendRequest(loadData)
    }
  };
  sendRequest(req) {
    this.props._crudActions.Read(req)
  }
  Read(res) { this.props._crudActions.Read({targetKey: this.props.targetKey, ...res}) }
  Refresh(res) { this.props._crudActions.Refresh({targetKey: this.props.targetKey, ...res}) }
  Create(res) { this.props._crudActions.Create({targetKey: this.props.targetKey, ...res}) }
  Update(res) { this.props._crudActions.Update({targetKey: this.props.targetKey, ...res}) }
  Delete(res) { this.props._crudActions.Delete({targetKey: this.props.targetKey, ...res}) }
  SetParameters(res) { this.props._crudActions.SetParameters({targetKey: this.props.targetKey, ...res}) }
  Clean(res) { this.props._crudActions.Clean({targetKey: this.props.targetKey, ...res}) }
  CreateLocal(res) { this.props._crudActions.CreateLocal({targetKey: this.props.targetKey, ...res}) }
  DeleteLocal(res) { this.props._crudActions.DeleteLocal({targetKey: this.props.targetKey, ...res}) }
  UpdateLocal(res) { this.props._crudActions.UpdateLocal({targetKey: this.props.targetKey, ...res}) }

  componentWillUnmount() {
    const {loadData, clearOnUnMount} = this.props
    if(loadData && clearOnUnMount) {
      if(isArray(loadData)) loadData.forEach(req => this.props._crudActions.Clean({targetKey: req.targetKey}))
      else this.props._crudActions.Clean({targetKey: loadData.targetKey})
    }
  }

  render() {
    const {component, render, children, loadData, _crudActions, ...resProps} = this.props

    let propsToPass = {
      ...resProps,
      crudActions: this.crudActions
    }

    if(component) {
      return createElement(component, propsToPass)
    }
    if (typeof children === 'function') {
      return children(propsToPass)
    }
    if(render) {
      return render(propsToPass)
    }
    return this.props.children
  }
}

// NetProvider.propTypes = {
//   renderResponse: PropTypes.boolean
// };
NetProvider.defaultProps = {
  clearOnUnMount: true // Remove data from store on componentWillUnmount.
};

export default connect(NetProvider);
