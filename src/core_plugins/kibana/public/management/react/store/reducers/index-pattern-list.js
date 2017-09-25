import { handleActions } from 'redux-actions';
import { set } from 'object-path-immutable';

import {
  fetchedIndexPatterns,
} from '../actions/index-pattern-list';

import {
  getIndexPatternList,
} from '../../reducers';

const defaultState = {
  indexPatterns: undefined,
  listTable: {},
};

export default handleActions({
  [fetchedIndexPatterns](state, { payload }) {
    const { indexPatterns } = payload;

    return {
      ...state,
      indexPatterns,
    };
  },
}, defaultState);

export const getIndexPatterns = state => getIndexPatternList(state).indexPatterns;
export const getPathToIndexPatterns = () => 'indexPatterns';
export const getPathToListTable = () => 'listTable';
