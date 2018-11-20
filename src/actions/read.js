/*
    -----------------------
          Read
    -----------------------
*/

export const READ = 'RC/READ';
export const REFRESH = 'RC/REFRESH'

/**
 * @function Read
 * Action To Trigger Read Worker
 * @param {string} payload.targetKey required
 * @param {string} payload.method // default is get
 * @see actions/index.js fetch payload
 */
export const Read = (payload) => ({
  type: READ,
  payload
});

/**
 * @function refresh
 * Action To Trigger Read Worker With The Last Read Parameters
 * @param {string} payload.targetKey
 * @param {string} payload.method // default is get
 */
export const Refresh = (payload) => ({
  type: REFRESH,
  payload
});
