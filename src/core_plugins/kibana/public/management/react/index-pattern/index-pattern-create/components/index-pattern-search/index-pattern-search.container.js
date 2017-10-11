/* eslint-disable */
import { connect } from 'react-redux';
import IndexPatternSearch from './index-pattern-search.component';

import {
  fetchIndices,
} from 'plugins/kibana/management/react/store/actions/index-pattern-creation';

import {
  getIndexPatternCreate,
} from 'plugins/kibana/management/react/reducers';

export default connect(
  state => {
    const { foundExactMatches } = getIndexPatternCreate(state);
    return { foundExactMatches };
  },
  { fetchIndices },
)(IndexPatternSearch);
