/* eslint-disable no-console */
export let api = null;

export const setApiInstance = function(axiosInstance) {
  api = axiosInstance
}

export const setApiInstanceHeaders = function(headers) {
  if(!api) {
    console.warn('net-provider - you try to setApiInstanceHeaders before setApiInstance')
  }else{
    for (var key in headers) {
      api.defaults.headers[key] = headers[key]
    }
  }
}
