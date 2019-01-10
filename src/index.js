import _NetProvider from './NetProvider';
import _Selector from './Selector/index';
import reducer from './reducer/index'
import saga from './saga'

import {Create, CreateLocal, Read, Refresh, Update, UpdateLocal, Delete, DeleteLocal} from './actions'
import {getFetchObject, getCrudState, getErrorByKey, getLoadingByKey, getCountByKey, getDataByKey, getStatusByKey} from './selectors'

export const actions = {
  Create, CreateLocal, Read, Refresh, Update, UpdateLocal, Delete, DeleteLocal
}
export const selectors = {
  getCrudState,
  'getCrudObject': getFetchObject,
  'getError': getErrorByKey,
  'getLoading': getLoadingByKey,
  'getCount': getCountByKey,
  'getData': getDataByKey,
  'getStatus': getStatusByKey,
}
export {setDefaultIdKey, idKey} from './enum';
export { setApiInstance, setApiInstanceHeaders } from './api';
export {setDispatch, dispatchAction} from './dispatch'
export {setErrorHandler} from './errorHandler';
export const Selector = _Selector
export const NetProvider = _NetProvider
export const crudReduxReducer = reducer
export const crudReduxSaga = saga
