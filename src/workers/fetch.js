import { put, select, call } from 'redux-saga/effects';
import { SetParameters, Refresh } from '../actions';
import {api} from '../api'
import { getLastRead, getDataByKey, isTargetExists } from '../selectors';
import {httpRequestStatuses} from '../enum';
import {errHandler} from '../errorHandler';

const getKey = function(action) {
  return action.payload.customKey || action.payload.key
}

const getRefreshType = function(lastRequest, payload) {
  return payload.refreshType || (lastRequest && lastRequest.refreshType) || 'server'
}

const validateAction = function(targetKey, url, axiosInstanceToUse, customFetch) {
  // CHECK REQUIRES
  if((!customFetch && !axiosInstanceToUse) || (!targetKey || !url)) {
    const errors = []
    if(!targetKey) errors.push('net-provider - action must have targetKey')
    if(!url) errors.push('net-provider - action must have url')
    if(!axiosInstanceToUse) errors.push('net-provider - Your action must include customAxiosInstance or use net-provider.setApiInstance()')
    throw errors.join(',')
  }
}

export default function* fetch(action, crudType) {
  const {targetKey, method = 'get', url, customAxiosInstance, customFetch, data, params, _dispatchId, boomerang, customHandleResponse, useResponseValues} = action.payload
  const _isTargetExists = yield select(state => isTargetExists(state, targetKey))
  const requestStatus = httpRequestStatuses[crudType]
  const axiosInstanceToUse = customAxiosInstance || api;
  let finalResponse, lastRequestByTarget, currentData, refreshType;
  validateAction(targetKey, url, axiosInstanceToUse, customFetch);

  const onStartPayload = { url, targetKey, status: requestStatus.start, error: null, loading: true, dispatchId: _dispatchId, boomerang }

  if(crudType !== 'read') { // refreshType will be set from action.payload or from lastRead or default
    lastRequestByTarget = yield select(state => getLastRead(state, action.payload.targetKey))
    refreshType = getRefreshType(lastRequestByTarget, action.payload)
  }else{
    onStartPayload.lastRead = action.payload // lastRead was passed only by read Worker to creating the ability to Refresh the data in the future
  }

  if(_isTargetExists && refreshType !== 'none' && !useResponseValues) { // In This case we want to update the data before the request and save currentData for case that response will fail
    // Save current data
    currentData = yield select(state => getDataByKey(state, targetKey))
    // Update local
    yield put(SetParameters(onStartPayload, crudType, {...action.payload}))
  }else{
    yield put(SetParameters(onStartPayload));
  }

  if(action.payload.onStart) { action.payload.onStart({action: onStartPayload}) } // RUN onStart CALLBACK

  // MAKE THE REQUEST
  try {
    let response = null
    if(customFetch) {
      response = yield call(customFetch, { url,
        method,
        data,
        params,
        payload: action.payload
      })
    }else{
      response = yield call(axiosInstanceToUse.request, {
        url,
        method,
        data,
        params
      })
    }
    const dataFromResponse = customHandleResponse ? customHandleResponse(response) : response.data
    // REQUEST SUCCESS
    finalResponse = { targetKey, status: requestStatus.success, error: null, loading: false, data: dataFromResponse }

    if(crudType !== 'read') {
      delete finalResponse.data // We did not want to replace list data with document data

      if(refreshType === 'server') { // In This Case We Want To Refresh The List With NEw Data From Server
        yield put(SetParameters(finalResponse))
        yield put(Refresh({targetKey}))
      }else if(useResponseValues) { // In This Case We Want To Update Local List With The Document Response From Server
        yield put(SetParameters(finalResponse, crudType, {...action.payload, data: dataFromResponse}))
      }else{ // refreshType === 'none' Then leave the list data as is
        yield put(SetParameters(finalResponse))
      }
    }else{
      yield put(SetParameters(finalResponse))
    }
    // RUN onEnd CALLBACK
    if(action.payload.onEnd) { action.payload.onEnd({action: finalResponse, response, data: dataFromResponse}) }

    return finalResponse
  } catch (error) {
    errHandler(error)
    // REQUEST FAILED
    finalResponse = { targetKey, status: requestStatus.failed, error: error, loading: false }
    if(_isTargetExists && refreshType !== 'none' && !useResponseValues) {
      finalResponse.data = currentData
      // Request Failed And we Change before The Request The List Data, Lets Recover The Data
      yield put(SetParameters(finalResponse));
    }else{
      yield put(SetParameters(finalResponse));
    }
    // RUN onFailed CALLBACK
    if(action.payload.onFailed) { action.payload.onFailed({error, action: finalResponse}) }
    return finalResponse
  }
}
/* eslint no-unused-vars: "off" */
