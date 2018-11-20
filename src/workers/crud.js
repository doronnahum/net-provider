/* eslint-disable no-console */
import { select } from 'redux-saga/effects';
import fetchWorker from './fetch';
import { getLastRead } from '../selectors';

const getLastRequestUrl = function(action, lastRequestByTarget) {
  if(lastRequestByTarget) {
    if(lastRequestByTarget.id) {
      return lastRequestByTarget.url
    }else{
      return `${lastRequestByTarget.url}/${action.payload.id}`
    }
  }
}

export function* getRequestUrl(action) {
  const lastRequestByTarget = yield select(state => getLastRead(state, action.payload.targetKey))
  let url = action.payload.url || getLastRequestUrl(action, lastRequestByTarget)
  if(!url) {
    console.warn('net-provider - Your crud request are missing url')
  }
  return url
}

export function* readWorker(action) {
  const actionPayload = Object.assign({method: 'get'}, action.payload)
  // MAKE THE FETCH REQUEST
  yield fetchWorker({payload: actionPayload}, 'read')
}

export function* refreshWorker(action) {
  const lastRequestByTarget = yield select(state => getLastRead(state, action.payload.targetKey))
  const actionPayload = Object.assign({}, lastRequestByTarget, action.payload)
  // MAKE THE FETCH REQUEST
  yield fetchWorker({payload: actionPayload}, 'read')
}

export function* createWorker(action) {
  const actionPayload = Object.assign({method: 'post'}, action.payload)
  // MAKE THE FETCH REQUEST
  yield fetchWorker({payload: actionPayload}, 'create')
}

export function* updateWorker(action) {
  let url = yield getRequestUrl(action)
  const actionPayload = Object.assign({method: 'put', url}, action.payload)
  // MAKE THE FETCH REQUEST
  yield fetchWorker({payload: actionPayload}, 'update')
}

export function* deleteWorker(action) {
  let url = yield getRequestUrl(action)
  const actionPayload = Object.assign({method: 'delete', url}, action.payload)
  // MAKE THE FETCH REQUEST
  yield fetchWorker({payload: actionPayload}, 'delete')
}
