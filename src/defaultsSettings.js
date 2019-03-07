let defaultHandlers = {
  customHandleResponse: res => res.data,
  getCountFromResponse: res => res.count,
}
let defaultConfig = {
  useResponseValuesWhenFound: true,
}
let defaultUpdateMethod = 'put';

/**
 * @function setDefaultUpdateMethod
 * @param {string} method 'put' || 'patch'
 */
let setDefaultUpdateMethod = function(method) {
  if(method !== 'put' && method !== 'patch') {
    console.log(`net-provider - are you sure that your update method is ${method}?`)
  }
  defaultUpdateMethod = method
}

/**
 * setDefaultHandlers
 * @param {object} res
 * @param {function} res.customHandleResponse
 * @param {function} res.getCountFromResponse
 */
const setDefaultHandlers = function(res) {
  if(res && res.customHandleResponse) {
    defaultHandlers.customHandleResponse = res.customHandleResponse
  }
  if(res && res.getCountFromResponse) {
    defaultHandlers.getCountFromResponse = res.getCountFromResponse
  }
}
export {
  defaultHandlers,
  setDefaultHandlers,
  defaultUpdateMethod,
  setDefaultUpdateMethod,
  defaultConfig
}
