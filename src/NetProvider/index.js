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
    this.getTargetKey = this.getTargetKey.bind(this);
    this.getUrl = this.getUrl.bind(this);
    this.sendRequest = this.sendRequest.bind(this);
  };

  componentDidMount () {
    const {loadData, targetKey} = this.props
    if(loadData) {
      if(isArray(loadData)) {
        loadData.forEach(req => this.sendRequest(req))
      }else{
        this.sendRequest(loadData)
        if(targetKey && loadData.targetKey !== targetKey) {
          console.warn('redux-admin error, loadData.targetKey !== this.props.targetKey')
        }else if(targetKey && !loadData.targetKey) {
          console.warn('redux-admin error, missing loadData.targetKey || this.props.targetKey')
        }
      }
    }
  };
  sendRequest(req) {
    this.props._crudActions.Read(req)
  }
  getTargetKey() {
    const {targetKey, loadData} = this.props
    if(targetKey) return targetKey
    if(loadData && loadData.targetKey) return loadData.targetKey
    if(loadData && loadData[0] && loadData[0].targetKey) return loadData[0].targetKey
  }
  getUrl() {
    const {loadData} = this.props
    if(loadData && loadData.targetKey) return loadData.url
    if(loadData && loadData[0] && loadData[0].url) return loadData[0].url
  }
  Read(res) { this.props._crudActions.Read({targetKey: this.getTargetKey(), url: this.getUrl(), url: this.getUrl(), ...res}) }
  Refresh(res) { this.props._crudActions.Refresh({targetKey: this.getTargetKey(), url: this.getUrl(), ...res}) }
  Create(res) { this.props._crudActions.Create({targetKey: this.getTargetKey(), url: this.getUrl(), ...res}) }
  Update(res) { this.props._crudActions.Update({targetKey: this.getTargetKey(), url: this.getUrl(), ...res}) }
  Delete(res) { this.props._crudActions.Delete({targetKey: this.getTargetKey(), url: this.getUrl(), ...res}) }
  SetParameters(res) { this.props._crudActions.SetParameters({targetKey: this.getTargetKey(), url: this.getUrl(), ...res}) }
  Clean(res) { this.props._crudActions.Clean({targetKey: this.getTargetKey(), url: this.getUrl(), ...res}) }
  CreateLocal(res) { this.props._crudActions.CreateLocal({targetKey: this.getTargetKey(), url: this.getUrl(), ...res}) }
  DeleteLocal(res) { this.props._crudActions.DeleteLocal({targetKey: this.getTargetKey(), url: this.getUrl(), ...res}) }
  UpdateLocal(res) { this.props._crudActions.UpdateLocal({targetKey: this.getTargetKey(), url: this.getUrl(), ...res}) }

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
