export const defaultSelectString = 'status,data,error,loading,targetKey,method,count,url'

export const newFetch = {
  status: null,
  data: null,
  error: null,
  loading: null,
  lastAction: null,
  url: null,
  method: null,
  boomerang: null,
  dispatchId: null,
  count: null,
  updatedKeys: ''
}

const getHttpRequestStatuses = function(method) {
  return {
    start: `${method}-start`,
    success: `${method}-success`,
    failed: `${method}-failed`,
  }
}
export const httpRequestStatuses = {
  create: getHttpRequestStatuses('create'),
  read: getHttpRequestStatuses('read'),
  update: getHttpRequestStatuses('update'),
  delete: getHttpRequestStatuses('delete'),
};

export let idKey = 'id';
export const setDefaultIdKey = function(id) {
  idKey = id
}
