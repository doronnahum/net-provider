import { put, select, call, all } from 'redux-saga/effects';
import { SetParameters, Refresh } from '../actions';
import {api} from '../api'
import { getFetchObject } from '../selectors';
import {httpRequestStatuses} from '../enum';
import {errHandler} from '../errorHandler';
import {defaultHandlers, defaultConfig} from '../defaultsSettings';

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
  const {targetKey, method = 'get', customAxiosInstance, customFetch, data, params, dispatchId, boomerang, customHandleResponse, useResponseValues, headers} = action.payload
  const fetchObject = yield select(state => getFetchObject(state, targetKey))
  const _isTargetExists = !!fetchObject.url
  let lastRequestByTarget = fetchObject.lastRead
  const url = action.payload.url || (lastRequestByTarget && lastRequestByTarget.url)
  const requestStatus = httpRequestStatuses[crudType]
  const axiosInstanceToUse = customAxiosInstance || api;
  let finalResponse, currentData, refreshType;
  validateAction(targetKey, url, axiosInstanceToUse, customFetch);

  const onStartPayload = { url, targetKey, status: requestStatus.start, error: null, loading: true, dispatchId: dispatchId, boomerang }

  if(crudType !== 'read') { // refreshType will be set from action.payload or from lastRead or default
    refreshType = getRefreshType(lastRequestByTarget, action.payload)
  }else{
    onStartPayload.lastRead = action.payload // lastRead was passed only by read Worker to creating the ability to Refresh the data in the future
  }

  // Save current data
  currentData = fetchObject.data
  if(_isTargetExists && refreshType !== 'none' && !useResponseValues) { // In This case we want to update the data before the request and save currentData for case that response will fail
    // Update local
    yield put(SetParameters(onStartPayload, crudType, {...action.payload}))
  }else{
    yield put(SetParameters(onStartPayload));
  }

  if(action.payload.onStart) { action.payload.onStart({action: onStartPayload}) } // RUN onStart CALLBACK

  // MAKE THE REQUEST
  try {
    let response = null
    let count = null;
    const requestConfig = { url, method, data, params }
    if(headers) requestConfig.headers = headers;
    const countConfig = !!action.payload.getCountRequestConfig && action.payload.getCountRequestConfig({actionPayload: action.payload, response, fetchObject})
    // countConfig false when getCountRequestConfig is missing or user return false getCountRequestConfig to persist the same count
    if(countConfig) {
      const [_response, _count] = yield all([ // Fetch data and query for count
        customFetch
          ? call(customFetch, { ...requestConfig, payload: action.payload })
          : call(axiosInstanceToUse.request, requestConfig),
        call(axiosInstanceToUse.request, countConfig)
      ])
      response = _response
      count = yield call(action.payload.getCountFromResponse, _count) // find count from response
    }else{ // Not need to count, just fetch data
      if(customFetch) {
        response = yield call(customFetch, { ...requestConfig, payload: action.payload })
      }else{
        response = yield call(axiosInstanceToUse.request, requestConfig)
      }
    }
    const dataFromResponse = customHandleResponse ? customHandleResponse(response) : defaultHandlers.customHandleResponse(response, crudType)
    if(!action.payload.getCountRequestConfig && action.payload.getCountFromResponse) {
      count = yield call(action.payload.getCountFromResponse, response)
    }else if(action.payload.getCountRequestConfig && !countConfig) {
      count = defaultHandlers.getCountFromResponse(response) || fetchObject.count || 0;
    }

    // REQUEST SUCCESS
    finalResponse = { targetKey, status: requestStatus.success, error: null, loading: false, data: dataFromResponse }
    if(typeof count === 'number') finalResponse.count = count;
    if(crudType !== 'read') {
      if(!Array.isArray(dataFromResponse) && Array.isArray(currentData)) {
        delete finalResponse.data // We did not want to replace list data with document data
      }
      if(refreshType === 'server') { // In This Case We Want To Refresh The List With NEw Data From Server
        yield put(SetParameters(finalResponse))
        yield put(Refresh({targetKey}))
      }else if(useResponseValues || (defaultConfig.useResponseValuesWhenFound && finalResponse.data)) { // In This Case We Want To Update Local List With The Document Response From Server
        yield put(SetParameters(finalResponse, crudType, {...action.payload, data: dataFromResponse}))
      }else{ // refreshType === 'none' Then leave the list data as is
        yield put(SetParameters(finalResponse))
      }
    }else{
      yield put(SetParameters(finalResponse))
    }

    // if(action.payload.getCountRequestConfig) {
    //   try {
    //     const config = action.payload.getCountRequestConfig({actionPayload: action.payload, response, fetchObject})
    //     if(!config) {
    //       // when return false then persist last count
    //       count = fetchObject.count || 0;
    //     }else{
    //       const countResponse = yield call(axiosInstanceToUse.request, config)
    //       if(action.payload.getCountFromResponse) {
    //         count = yield call(action.payload.getCountFromResponse, countResponse)
    //       }else{
    //         console.error('redux-admin, getCountFromResponse is required when using getCountRequestConfig')
    //       }
    //     }
    //     yield put(SetParameters({targetKey, count}))
    //   } catch (error) {
    //     count = null
    //   }
    // }

    // RUN onEnd CALLBACK
    if(action.payload.onEnd) { action.payload.onEnd({action: finalResponse, response, data: dataFromResponse}) }

    return finalResponse
  } catch (error) {
    console.log({error})
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
