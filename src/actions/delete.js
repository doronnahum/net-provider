/*
    -----------------------
          Delete
    -----------------------
*/

export const DELETE = 'RC/DELETE';
export const DELETE_LOCAL = 'RC/DELETE_LOCAL';

/**
 * @function Delete
 * @description This Action Will Delete a Doc From Server.
 * onSuccess dispatch DELETE_LOCAL
 * @param {string} payload.target required
 * @param {string} payload.url required
 * @param {string} payload.method // default is delete
 * @param {string} payload.data required
 * @param {string} payload.id required only when the state[target]data is a List
 * @param {string} payload.idKey required only when the state[target]data is a List and the unique is not 'id'
 * @see actions/index.js fetch payload
*/
export const Delete = (payload) => ({
  type: DELETE,
  payload
});

/**
 * @function DeleteLocal
 * @description This Action will Delete the data from store
 * when target.data is object : state[target].data = null
 * when target.data is array : state[target].data.filter(item => item[payload.idKey] !== payload.id)
 * @param {string} payload.target
 * @param {string} payload.id required only when state[target]data is a List
 * @param {string} payload.idKey required only when the target.data is a List and the unique is not 'id'
 */
export const DeleteLocal = (payload) => ({
  type: DELETE_LOCAL,
  payload
});
