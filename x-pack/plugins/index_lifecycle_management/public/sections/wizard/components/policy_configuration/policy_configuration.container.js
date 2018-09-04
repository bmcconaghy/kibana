/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { connect } from 'react-redux';
import { PolicyConfiguration as PresentationComponent } from './policy_configuration';
import {
  getSelectedPolicyName,
  getAffectedIndexTemplates,
  getSelectedIndexTemplateName,
  getBootstrapEnabled,
  getIndexName,
  getAliasName,
  getSelectedOriginalPolicyName,
  getIsSelectedPolicySet,
  getPolicies
} from '../../../../store/selectors';
import {
  setBootstrapEnabled,
  setIndexName,
  setAliasName,
  setSelectedPolicyName,
  unsetSelectedPolicy
} from '../../../../store/actions';

export const PolicyConfiguration = connect(
  state => ({
    isSelectedPolicySet: getIsSelectedPolicySet(state),
    selectedPolicyName: getSelectedPolicyName(state),
    selectedIndexTemplateName: getSelectedIndexTemplateName(state),
    affectedIndexTemplates: getAffectedIndexTemplates(state),
    bootstrapEnabled: getBootstrapEnabled(state),
    indexName: getIndexName(state),
    aliasName: getAliasName(state),
    originalPolicyName: getSelectedOriginalPolicyName(state),
    hasExistingPolicies: getPolicies(state).length > 0
  }),
  {
    setBootstrapEnabled,
    setIndexName,
    setAliasName,
    setSelectedPolicyName,
    unsetSelectedPolicy
  }
)(PresentationComponent);
