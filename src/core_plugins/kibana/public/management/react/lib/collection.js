import { once, chunk } from 'lodash';
import { createAction, handleActions } from 'redux-actions';

const defaults = {
  sortAsc: true,
  pageNumber: 1,
  pageSize: 10,
  sortField: 'name'
};
export const createCollectionReducer = (name) => {
  const { setSortField, setSortAsc, setPageNumber, setPageSize } = getCollectionActions(name);
  return handleActions({
    [setSortField](state, { payload }) {
      return {
        ...state,
        sortField: payload
      };
    },
    [setSortAsc](state, { payload }) {
      return {
        ...state,
        sortAsc: payload
      };
    },
    [setPageNumber](state, { payload }) {
      return {
        ...state,
        pageNumber: payload
      };
    },
    [setPageSize](state, { payload }) {
      return {
        ...state,
        pageSize: payload
      };
    }
  }, defaults);
};

export const getCollectionActions = once((name) => {
  return {
    setSortField: createAction(`COLLECTION_CHANGE_SORT_FIELD_${name.toUpperCase()}`),
    setSortAsc: createAction(`COLLECTION_CHANGE_SORT_ASC_${name.toUpperCase()}`),
    setPageNumber: createAction(`COLLECTION_CHANGE_PAGE_NUMBER_${name.toUpperCase()}`),
    setPageSize: createAction(`COLLECTION_CHANGE_PAGE_SIZE_${name.toUpperCase()}`),
  }
});

export const getItems = (items, metadata) => {
  const { sortBy, sortAsc, page, perPage, filterBy } = metadata;

  const numOfPages = Math.ceil(items.length / perPage);

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
  if (!!sortBy) {
    items = sortByLodash(items, sortBy);
    if (!!!sortAsc) {
      items.reverse();
    }
  }

  // paginate
  const pages = chunk(items, perPage);
  items = pages[page] || [];

  return { items, numOfPages };
}
