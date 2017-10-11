import { handleActions } from 'redux-actions';
import { createSelector } from 'reselect';
import { chunk, sortBy as sortByLodash, pick } from 'lodash';
import { set } from 'object-path-immutable';
import { createCollectionReducer, getItems } from "../../lib/collection";

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
  isIncludingSystemIndices: false,
  isCreating: false,
  timeFields: {
    timeFields: undefined,
    selectedTimeField: undefined,
  },
  foundIndices: null,
  searchPattern: null,
  foundExactMatches: false,
};

export default handleActions({
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
      collectionMetadata: createCollectionReducer('foundIndices')
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
  console.log(state)
  const { foundIndices, collectionMetadata } = getIndexPatternCreate(state);
  return foundIndices ? getItems(foundIndices, collectionMetadata) : {};
};
export const foundExactMatches = (state) => {
  return getIndexPatternCreate(state).foundExactMatches;
};
