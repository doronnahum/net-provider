/* eslint-disable no-console */
import {SetParameters, Clean, Create, CreateLocal, Delete, DeleteLocal, Read, Refresh, Update, UpdateLocal} from './actions';
let dispatch

const sendAction = (action) => {
  if(!dispatch) {
    console.warn('net-provider - to use dispatchAction you need to setDispatch ')
  }else{
    dispatch(action)
  }
}
export const setDispatch = function(_dispatch) {
  dispatch = _dispatch
};
export const dispatchAction = {
  SetParameters: payload => sendAction(SetParameters(payload)),
  Clean: payload => sendAction(Clean(payload)),
  Create: payload => sendAction(Create(payload)),
  CreateLocal: payload => sendAction(CreateLocal(payload)),
  Delete: payload => sendAction(Delete(payload)),
  DeleteLocal: payload => sendAction(DeleteLocal(payload)),
  Read: payload => sendAction(Read(payload)),
  Refresh: payload => sendAction(Refresh(payload)),
  Update: payload => sendAction(Update(payload)),
  UpdateLocal: payload => sendAction(UpdateLocal(payload)),
};
