import {SET_PARAMETERS, CLEAN, DELETE_LOCAL, UPDATE_LOCAL, CREATE_LOCAL} from '../actions';
import {setParameters, deleteLocal, cleanKeyFromStore, updateLocal, createLocal} from './helpers'

const initialState = {}

export default function reducer(state = initialState, action) {
  let nextState
  switch (action.type) {
    case SET_PARAMETERS: {
      if(!action.crudType || action.crudType === 'read') {
        return setParameters(state, action)
      }else if(['delete', 'update', 'create'].includes(action.crudType)) {
        nextState = setParameters(state, action)
        action.payload.id = action.crudPayload.id
        action.payload.idKey = action.crudPayload.idKey
        action.payload.data = action.crudPayload.data
        if(action.crudType === 'delete') {
          return deleteLocal(nextState, action)
        }else if(action.crudType === 'update') {
          return updateLocal(nextState, action)
        }else if(action.crudType === 'create') {
          return createLocal(nextState, action)
        }
        return nextState
      }else{
        return nextState
      }
    }
    case CLEAN: {
      return cleanKeyFromStore(state, action)
    }
    case DELETE_LOCAL: {
      return deleteLocal(state, action)
    }
    case UPDATE_LOCAL: {
      return updateLocal(state, action)
    }
    case CREATE_LOCAL: {
      return createLocal(state, action)
    }
    default:
      return state;
  }
};
