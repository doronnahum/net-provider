import { createSelector } from 'reselect';
import isArray from 'lodash/isArray';
const getRelevantProps = (state, { loadData, targetKey, select, toSelect, selectorComponent }) => {
  return { loadData, targetKey, select, toSelect, selectorComponent }
};

export const getCrudState = state => state.crud;

const emptyObject = {};
const getFetchObjectFromCrudState = function(crudState, targetKey, toSelect) {
  const fetchObject = crudState[targetKey] || emptyObject
  if(toSelect) { // toSelect is string like 'loading,data' that filter the props the component want to get
    const response = {};
    toSelect.split(',').forEach(key => { response[key] = fetchObject[key] })
    return response
  }else{
    return fetchObject
  }
}

export const getMapStateToProps = createSelector(
  [getCrudState, getRelevantProps],
  (crudState, props) => {
    let propsResponse = {}
    const { loadData, targetKey, select, toSelect, selectorComponent } = props
    if(selectorComponent) {
      if(select && select !== '') {
        const selectArr = select.split(',');
        if(selectArr.length === 1) {
          propsResponse = Object.assign(propsResponse, getFetchObjectFromCrudState(crudState, select, toSelect))
        }else{
          selectArr.forEach(_select => {
            propsResponse = Object.assign(propsResponse, {[_select]: getFetchObjectFromCrudState(crudState, _select, toSelect)})
          })
        }
      }else{
        if(targetKey) {
          propsResponse = Object.assign(propsResponse, getFetchObjectFromCrudState(crudState, targetKey, toSelect))
        }
      }
    }else{
      if(isArray(loadData)) {
        loadData.forEach(item => {
          if(item.targetKey !== targetKey) {
            propsResponse = Object.assign(propsResponse, {[item.targetKey]: getFetchObjectFromCrudState(crudState, item.targetKey, toSelect)})
          }
        })
      }
      propsResponse = Object.assign(propsResponse, getFetchObjectFromCrudState(crudState, targetKey || loadData.targetKey, toSelect))
    }

    return propsResponse
  }
);
const getSecondeArgument = (state, targetKey) => targetKey;
export const getFetchObject = createSelector(
  [getCrudState, getSecondeArgument],
  (crudState, targetKey) => crudState[targetKey] || {}
);
/**
 * @function getLastRead
 * @description Selector that return the last action from crudStore['targetKey'].lastRead
 */
export const getLastRead = createSelector(getFetchObject, fetchObject =>
  fetchObject.lastRead || {}
);
export const getErrorByKey = createSelector(getFetchObject, fetchObject =>
  fetchObject.loading
);
export const getLoadingByKey = createSelector(getFetchObject, fetchObject =>
  fetchObject.loading
);
export const getCountByKey = createSelector(getFetchObject, fetchObject =>
  fetchObject.count
);
export const getDataByKey = createSelector(getFetchObject, fetchObject =>
  fetchObject.data
);
export const isTargetExists = createSelector([getCrudState, getSecondeArgument], (crudState, targetKey) =>
  !!crudState[targetKey]
);
// export const getDispatchId = createSelector(getImmutableDoc, dataImmutable =>
//   dataImmutable.get('dispatchId')
// );
// export const getBoomerang = createSelector(getImmutableDoc, dataImmutable =>
//   dataImmutable.get('boomerang')
// );
// export const getLoading = createSelector(getImmutableDoc, dataImmutable =>
//   isLoading(dataImmutable.get('status'))
// );

// export const getInfo = createSelector(getImmutableDoc, dataImmutable =>
//   dataImmutable.get('info')
// );

// export const getError = createSelector(getImmutableDoc, dataImmutable =>
//   dataImmutable.get('error')
// );
