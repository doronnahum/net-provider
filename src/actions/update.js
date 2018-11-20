/*
    -----------------------
          Update
    -----------------------
*/

export const UPDATE = 'RC/UPDATE';
export const UPDATE_LOCAL = 'RC/UPDATE_LOCAL';

/**
 * @function Update
 * @description This Action Will Update Data On Server.
 * Pass id when state[targetKey]data is array
 * onSuccess will dispatch UPDATE_LOCAL
 * @param {object} payload
 * @param {string} payload.targetKey required
 * @param {string} payload.url required
 * @param {object} payload.data required
 * @param {string} payload.method default is put
 * @param {string} payload.id required only when the state[targetKey]data is List
 * @param {string} payload.idKey required only when the state[targetKey]data is a List and the unique is not 'id'
 * @see actions/index.js fetch payload
*/
export const Update = (payload) => ({
  type: UPDATE,
  payload
});

/**
 * @function UpdateLocal
 * @description This Action will Merge newData into currentData
 * Pass id when state[targetKey]data is array
 * @param {string} payload.targetKey
 * @param {string} payload.data
 * @param {string} payload.id required only when the state[targetKey]data is a List
 * @param {string} payload.idKey required only when the state[targetKey]data is a List and the unique is not 'id'
 */
export const UpdateLocal = (payload) => ({
  type: UPDATE_LOCAL,
  payload
});
