import { chunk, sortBy as sortByLodash, once } from 'lodash';
import { createAction, handleActions } from 'redux-actions';

const defaults = {
  sortAsc: true,
  pageNumber: 0,
  pageSize: 10,
  sortField: 'name'
};

export const getDefaults = (name) => {
  return {
    [metadataKeyName(name)]: {
      ...defaults
    }
  };
};

export const metadataKeyName = (name) => (`__collection_metadata_${name}`);

export const createActionHandlers = once((name) => {
  const { setSortField, setSortAsc, setPageNumber, setPageSize } = getCollectionActions(name);
  const keyName = metadataKeyName(name);
  return {
    [setSortField](state, { payload }) {
      return {
        ...state,
        [keyName] : {
          ...state[keyName],
          sortField: payload
        }
      };
    },
    [setSortAsc](state, { payload }) {
      return {
        ...state,
        [keyName] : {
          ...state[keyName],
          sortAsc: payload
        }
      };
    },
    [setPageNumber](state, { payload }) {
      return {
        ...state,
        [keyName] : {
          ...state[keyName],
          pageNumber: payload
        }
      };
    },
    [setPageSize](state, { payload }) {
      return {
        ...state,
        [keyName] : {
          ...state[keyName],
          pageSize: payload
        }
      };
    }
  };
});

export const getCollectionActions = once((name) => {
  return {
    setSortField: createAction(`COLLECTION_CHANGE_SORT_FIELD_${name.toUpperCase()}`),
    setSortAsc: createAction(`COLLECTION_CHANGE_SORT_ASC_${name.toUpperCase()}`),
    setPageNumber: createAction(`COLLECTION_CHANGE_PAGE_NUMBER_${name.toUpperCase()}`),
    setPageSize: createAction(`COLLECTION_CHANGE_PAGE_SIZE_${name.toUpperCase()}`),
  }
});

export const getItems = (items, metadataContainer, name) => {
  console.log(metadataContainer);
  const metadata = metadataContainer[metadataKeyName(name)];
  console.log(items)
  const { sortField, sortAsc, pageNumber, pageSize, filterBy } = metadata;

  const numOfPages = Math.ceil(items.length / pageSize);

  // filter
  // if (!!filters) {
  //   items = items.filter(item => {
  //     return Object.keys(filters).every(filterKey => {
  //       const filterFn = filters[filterKey];
  //       const value = get(item, filterKey);
  //       const filterValue = filterBy[filterKey];
  //       return filterFn(value, filterValue);
  //     });
  //   });
  // }

  // sort
  if (!!sortField) {
    items = sortByLodash(items, sortField);
    if (!!!sortAsc) {
      items.reverse();
    }
  }

  // paginate
  const pages = chunk(items, pageSize);
  console.log(pages)
  items = pages[pageNumber] || [];
  console.log(`SORTED`)
  console.log(items)
  return { items, numOfPages };
}
