/* eslint-disable no-console */

export let errHandler = function(err) {
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    // dev code
    console.log('net-provider error handler', err)
  }else {
    // production code
  }
}
export const setErrorHandler = function(handler) {
  errHandler = handler
};
