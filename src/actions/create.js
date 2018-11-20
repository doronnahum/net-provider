/*
    -----------------------
          Create
    -----------------------
*/

export const CREATE = 'RC/CREATE';
export const CREATE_LOCAL = 'RC/CREATE_LOCAL';

/**
 * @function Create
 * @description This Action Will Create a New Doc On Server.
 * onSuccess dispatch CREATE_LOCAL
 * @param {string} payload.targetKey required
 * @param {string} payload.url required
 * @param {string} payload.method // default is post
 * @param {string} payload.data required
 * @param {string} payload.idKey required only when the state[targetKey]data is a List and the unique is not 'id'
 * @see actions/index.js fetch payload
*/
export const Create = (payload) => ({
  type: CREATE,
  payload
});

/**
 * @function CreateLocal
 * @description This action will set New Doc To state[targetKey].data
 * @param {string} payload.targetKey
 * @param {string} payload.data
 */
export const CreateLocal = (payload) => ({
  type: CREATE_LOCAL,
  payload
});
