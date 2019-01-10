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
* @param {string} payload.targetKey   <small> required </small>  the key to set the parameters in store
* @param {string} payload.url  API endpoint - required only for the first action to this targetKey
* @param {string} payload.method  one of ['get' , 'post' , 'put' , 'delete']
	  method will set by default base the action type but you can override this
	  defaults: Read() = 'get' | Create() = 'post' | Update() = 'put' | Delete() = 'delete'
* @param {object} payload.params request  params
* @param {object} payload.data request  params
* @param {string} payload.dispatchId pass dispatch Id that can help you track your specific request
* @param {func} payload.customHandleResponse   help us find the data from response when the structure is not response.data, this function will get the response from server and need to return the data
* @param {func} payload.getCountRequestConfig   use it when you want to fetch the count from diffrent url, function that get ({actionPayload, response, fetchObject}) => ({url, method, params, data}) , to persist count return false
* @param {func} payload.getCountFromResponse   help us find the count of your data from the response if it is possible
* @param {object} payload.customAxiosInstance {object} when the default axios is not relevant pass  a different instance
* @param {func} payload.customFetch - when you want to take the control of the fetch to your hand, can be useful for custom requests or for request that need to be handle by SDK or somthing else
    your function will be call by saga like this
    response = yield call(customFetch, { url, method, data, params, payload:  action.payload})
* @param {func} onStart - call back that be call before the request
* @param {func} payload.onEnd - call back that be call when request end
* @param {func} payload.onFailed - call back that be call when request failed
* @param {string} payload.refreshType  - one of ['local', 'server', 'none'] - <small>server is the default</small>
    This parameter is relevant when we change a record inside a list, we let you decide how to keep your list update after any change(create,delete,update)
    * local - when you dispatch request to server we will update the data Immediately, before we send the request to server, and if the request failed we will restore the change
                this option save data transfer and good for user experience
    *  server - in each success change on one of the records we will refresh all the list data.
                this option is the default, it will ensure that your data sync with the server, this default because sometimes one change can influencing other parameters
    * none - the list will not be affected
* @param {boolean} payload.useResponseValues - - sometimes when we put data to server it will return us an object or a list of objects with the updating values, set true if this is the situation to set the result from server on store
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
