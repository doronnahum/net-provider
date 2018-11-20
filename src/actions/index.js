import {Create, CreateLocal, CREATE, CREATE_LOCAL} from './create';
import {Read, Refresh, READ, REFRESH} from './read';
import {Update, UpdateLocal, UPDATE, UPDATE_LOCAL} from './update';
import {Delete, DeleteLocal, DELETE, DELETE_LOCAL} from './delete';

const SET_PARAMETERS = 'RC/SET_PARAMETERS'
const FETCH = 'RC/FETCH'
const CLEAN = 'RC/CLEAN'

/**
 * @function setParameters
 * @param {string} payload.targetKey // required
 * @param {string} payload.status // oneOf : 'START' , 'SUCCESS' , 'FAILED'
 * @param {object} payload.data // oneOfType object, 'arry
 * @param {object} payload.error // response from server
 * @param {boolean} payload.loading // boolean
 * @param {boolean} payload.dispatchId
 * @param {boolean} payload.boomerang
 * @param {boolean} payload.method
 * @param {boolean} payload.url
 */
const SetParameters = (payload, crudType, crudPayload) => ({
  type: SET_PARAMETERS,
  payload,
  crudType,
  crudPayload
});

/**
 * @function fetch
 * @param {string} payload.key // 'key' is required - the key to set the Parameters in store
 * @param {string} payload.customKey // 'customKey' - Use customKey if the key is used to other react purpose like in a list
 * @param {string} payload.method // 'method' is one of : ['get' , 'post' , 'put' , 'delete']. default is get.
 * @param {string} payload.url // 'url` is the server URL that will be used for the request
 * @param {object} payload.params // `params` are the URL parameters to be sent with the request, Must be a plain object or a URLSearchParams object
 * @param {object} payload.data   // `data` is the data to be sent as the request body
 * @param {object} payload.dispatchId   // Optional - pass `dispatchId` that can help you track on your request
 * @param {func} payload.customHandleResponse // 'customHandleResponse' - if the data in response from server is not response.data then pass function that get the response and return the data
 * @param {object} payload.customAxiosInstance // 'customAxiosInstance' - pass if you want to use a different instance
 * @param {function} payload.onStart   // 'onStart' - Optional - call back that run on start
 * @param {function} payload.onEnd  // 'onEnd' -Optional - call back that run on success
 * @param {function} payload.onFailed  // 'onFailed' - Optional - call back that run on failed
 * @param {string} payload.refreshType
 * // syncType
 * 'local' - local will create/remove/update the local list manually, if the request failed the list data will be restore
 * 'server' - Default - server will refresh from server after each success create/remove/update
 * 'none' - The list will not be affected
 * @param {boolean} payload.useResponseValues // set true to update the list with data from server and not with the data that send to server
 */

/**
 * @function clean
 * @param {string} payload.targetKey

 */
const Clean = (payload) => ({
  type: CLEAN,
  payload
});

export {
  Clean,
  CLEAN,
  SetParameters,
  SET_PARAMETERS,
  FETCH,
  Create, CreateLocal, CREATE, CREATE_LOCAL,
  Read, Refresh, READ, REFRESH,
  Update, UpdateLocal, UPDATE, UPDATE_LOCAL,
  Delete, DeleteLocal, DELETE, DELETE_LOCAL,
}
