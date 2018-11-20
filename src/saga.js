import {CREATE, READ, REFRESH, UPDATE, DELETE} from './actions';
import { takeEvery } from 'redux-saga/effects';
import {deleteWorker, updateWorker, createWorker, refreshWorker, readWorker} from './workers/crud'

// Collections

// all market watchers
export default function* watcher() {
  yield takeEvery(CREATE, createWorker);
  yield takeEvery(READ, readWorker);
  yield takeEvery(REFRESH, refreshWorker);
  yield takeEvery(UPDATE, updateWorker);
  yield takeEvery(DELETE, deleteWorker);
}
/* eslint no-unused-vars: "off" */
