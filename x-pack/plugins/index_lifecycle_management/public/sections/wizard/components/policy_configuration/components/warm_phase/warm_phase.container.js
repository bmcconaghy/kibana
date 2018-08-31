/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */




import { connect } from 'react-redux';
import { WarmPhase as PresentationComponent } from './warm_phase';
import {
  getNodeOptions,
  getPhase,
  getSelectedReplicaCount,
  getSelectedPrimaryShardCount
} from '../../../../../../store/selectors';
import { setPhaseData, fetchNodes } from '../../../../../../store/actions';
import { PHASE_WARM, PHASE_HOT, PHASE_ROLLOVER_ENABLED } from '../../../../../../store/constants';

export const WarmPhase = connect(
  state => ({
    phaseData: getPhase(state, PHASE_WARM),
    hotPhaseReplicaCount: Number(getSelectedReplicaCount(state)),
    hotPhasePrimaryShardCount: Number(getSelectedPrimaryShardCount(state)),
    hotPhaseRolloverEnabled: getPhase(state, PHASE_HOT)[PHASE_ROLLOVER_ENABLED],
    nodeOptions: getNodeOptions(state)
  }),
  {
    setPhaseData: (key, value) => setPhaseData(PHASE_WARM, key, value),
    fetchNodes
  }
)(PresentationComponent);
