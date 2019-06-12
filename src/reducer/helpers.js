/* eslint-disable no-console */
import produce from 'immer'; // https://github.com/mweststrate/immer#example-patterns
import {newFetch, idKey} from '../enum';
import isArray from 'lodash/isArray';
// import {createLocal} from './helpers'

export const getNewUpdatedKeys = function(currentUpdatedKeys = '', data) {
  const newUpdatedKeys = Object.keys(data).join(',')
  if(newUpdatedKeys !== '') {
    return currentUpdatedKeys + ',' + newUpdatedKeys
  }else{
    return currentUpdatedKeys
  }
}

/**
   * @function setParameters
   * @description This function will update any parameter from action.payload inside state.crud[targetKey]
   * When state.crud[targetKey] the function will create a newFetch object
   * @returns state object
   */
export const setParameters = function(state, action) {
  const targetKey = action.payload.targetKey
  const nextState = produce(state, draftState => {
    if(!draftState[targetKey]) {
      draftState[targetKey] = {...newFetch}
    }
    for (var key in action.payload) {
      draftState[targetKey][key] = action.payload[key]
    }
  })
  return nextState;
}

/**
   * @function cleanKeyFromStore
   * This function will remove state[targetKey]
   * @returns state object
   */
export const cleanKeyFromStore = function(state, action) {
  const targetKey = action.payload.targetKey
  const nextState = produce(state, draftState => {
    delete draftState[targetKey]
  })
  return nextState;
}

/**
   * @function deleteLocal
   * @description This Action will Merge newData into currentDataThis function will remove data from store
   * Pass payload.id when state[key]data is array
   * @returns state object
   */
export const deleteLocal = function(state, action) {
  const targetKey = action.payload.targetKey
  const _idKey = action.payload.idKey || idKey
  const nextState = produce(state, draftState => {
    if(draftState[targetKey]) {
      if(isArray(draftState[targetKey].data)) {
        if(action.payload.id) {
          const data = draftState[targetKey].data
          const itemIndex = data.findIndex(item => item[_idKey] === action.payload.id)
          if(itemIndex > -1) data.splice(itemIndex, 1)
        }else{
          console.warn('net-provider - To update your local data you need to pass action.payload.id')
        }
      }else{
        draftState[targetKey].data = null;
      }
    }
  })
  return nextState;
}

/**
   * @function updateLocal
   * @description This function will merge newData inside the currentData
   * Pass payload.id when state[targetKey]data is array
   * @returns state object
   */
export const updateLocal = function(state, action) {
  const targetKey = action.payload.targetKey
  // const _idKey = action.payload.idKey || idKey
  const nextState = produce(state, draftState => {
    if(draftState[targetKey]) {
      if(isArray(draftState[targetKey].data)) {
        if(action.payload.id) {
          // const itemIndex = draftState[targetKey].data.findIndex(item => item[_idKey] === action.payload.id)
          // // let doc = draftState[targetKey].data[itemIndex]
          // // if(typeof doc === 'object') {
          // //   doc = Object.assign(doc, action.payload.data)
          // // }
          if(!draftState[targetKey].updatedKeys) { draftState[targetKey].updatedKeys = {[action.payload.id]: ''} }
          draftState[targetKey].updatedKeys[action.payload.id] = getNewUpdatedKeys(draftState[targetKey].updatedKeys[action.payload.id], action.payload.data)
        }else{
          console.warn('net-provider - To update your local data you need to pass action.payload.id')
        }
      }else{
        if(!draftState[targetKey]) { draftState[targetKey] = newFetch };
        if(typeof draftState[targetKey].data !== 'object') { draftState[targetKey].data = {} };
        draftState[targetKey].data = Object.assign(draftState[targetKey].data, action.payload.data)
        draftState[targetKey].updatedKeys = getNewUpdatedKeys(draftState[targetKey].updatedKeys, action.payload.data)
      }
    }
  })
  return nextState;
}

/**
   * @function createLocal
   * @description This function will push item to data
   * @returns state object
   */
export const createLocal = function(state, action) {
  const targetKey = action.payload.targetKey
  const nextState = produce(state, draftState => {
    if(draftState[targetKey] && isArray(draftState[targetKey].data)) {
      if(isArray(draftState[targetKey].data)) {
        draftState[targetKey].data.push(action.payload.data)
      }else{
        draftState[targetKey].data = action.payload.data
      }
    }
  })
  return nextState;
}
