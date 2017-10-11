import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';
import { createSelector } from 'reselect';
import { chunk, sortBy as sortByLodash, pick } from 'lodash';
import { set } from 'object-path-immutable';
import { getDefaults, createActionHandlers, getItems, metadataKeyName } from "../../lib/collection";

const FOUND_INDICES = 'FOUND_INDICES';

import {
  selectTimeField,
  fetchedTimeFields,
  fetchedIndices,
  includeSystemIndices,
  excludeSystemIndices,
  creatingIndexPattern,
  createdIndexPattern,
} from '../actions/index-pattern-creation';

import {
  getIndexPatternCreate,
} from '../../reducers';

const defaultState = {
    ...getDefaults(FOUND_INDICES),
  isIncludingSystemIndices: false,
  isCreating: false,
  timeFields: {
    timeFields: undefined,
    selectedTimeField: undefined,
  },
};

export default handleActions({
  ...createActionHandlers(FOUND_INDICES),
  [selectTimeField](state, { payload }) {
    const { timeFields } = payload;

    return {
      ...state,
      timeFields: {
        ...state.timeFields,
        timeFields,
      },
    };
  },
  [fetchedTimeFields](state, { payload }) {
    const { timeFields } = payload;

    return {
      ...state,
      timeFields: {
        ...state.timeFields,
        timeFields,
      },
    };
  },
  [selectTimeField](state, { payload }) {
    const { timeField } = payload;

    return {
      ...state,
      timeFields: {
        ...state.timeFields,
        selectedTimeField: timeField,
      },
    };
  },
  [fetchedIndices](state, { payload }) {
    const { searchPattern, foundIndices, foundExactMatches } = payload;

    return {
      ...state,
      foundIndices,
      foundExactMatches,
      searchPattern,
    };
  },
  [creatingIndexPattern](state, action) {
    return {
      ...state,
      isCreating: true,
    };
  },
  [createdIndexPattern](state, action) {
    return {
      ...state,
      isCreating: false,
    };
  },
}, defaultState);

export const getSearchPattern = state => getIndexPatternCreate(state).searchPattern;
export const getSelectedTimeField = state => getIndexPatternCreate(state).timeFields.selectedTimeField;
export const getTimeFields = state => getIndexPatternCreate(state).timeFields;
export const getCreation = state => {
  const {
    isIncludingSystemIndices,
    isCreating,
    foundExactMatches,
  } = getIndexPatternCreate(state);
  return { isCreating, isIncludingSystemIndices, foundExactMatches };
};
export const getIsIncludingSystemIndices = state => getIndexPatternCreate(state).isIncludingSystemIndices;
export const getResults = state => getIndexPatternCreate(state).results;
export const getFoundIndices = (state) => {
  const indexPatternCreate = getIndexPatternCreate(state);
  const { foundIndices } = indexPatternCreate;
  return foundIndices ? getItems(foundIndices, indexPatternCreate, FOUND_INDICES) : {};
};
export const foundExactMatches = (state) => {
  return getIndexPatternCreate(state).foundExactMatches;
};
