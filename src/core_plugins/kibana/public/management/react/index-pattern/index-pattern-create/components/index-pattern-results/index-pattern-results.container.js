import { compose } from 'recompose';
import { connect } from 'react-redux';
import { getCollectionActions } from "../../../../lib/collection";


import IndexPatternResults from './index-pattern-results.component';

import {
  getIsIncludingSystemIndices,
  getFoundIndices,
  foundExactMatches,
  getSearchPattern
} from 'plugins/kibana/management/react/store/reducers/index-pattern-creation';

import {
  getIndexPatternCreate,
} from 'plugins/kibana/management/react/reducers';


export default connect(
  (state, ownProps) => {
    const { foundIndices, numPages }  = getFoundIndices(state);
    const { isIncludingSystemIndices } = ownProps;
    console.log(foundIndices)
    const indices = foundIndices
      ? foundIndices.filter(item => item.name[0] !== '.' || isIncludingSystemIndices)
      : undefined;

    return {
      indices,
      foundExactMatches: foundExactMatches(state),
      searchPattern: getSearchPattern(state)
    };
  },
  getCollectionActions('foundIndices')
)(IndexPatternResults);
