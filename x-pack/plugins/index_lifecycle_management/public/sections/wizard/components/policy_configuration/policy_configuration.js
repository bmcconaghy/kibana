/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { toastNotifications } from 'ui/notify';

import {
  EuiTitle,
  EuiSpacer,
  EuiHorizontalRule,
  EuiButton,
  EuiButtonEmpty,
  EuiFlexGroup,
  EuiFlexItem,
} from '@elastic/eui';
import { HotPhase } from './components/hot_phase';
import { WarmPhase } from './components/warm_phase';
import { DeletePhase } from './components/delete_phase';
import { ColdPhase } from './components/cold_phase';
import {
  PHASE_HOT,
  PHASE_COLD,
  PHASE_DELETE,
  PHASE_WARM,
} from '../../../../store/constants';
import { hasErrors } from '../../../../lib/find_errors';
import { NodeAttrsDetails } from '../node_attrs_details';
import { PolicySelection } from '../policy_selection/policy_selection.container';

export class PolicyConfiguration extends Component {
  static propTypes = {
    setSelectedPolicyName: PropTypes.func.isRequired,
    setIndexName: PropTypes.func.isRequired,
    setAliasName: PropTypes.func.isRequired,
    setBootstrapEnabled: PropTypes.func.isRequired,
    done: PropTypes.func.isRequired,
    back: PropTypes.func.isRequired,
    validate: PropTypes.func.isRequired,
    selectedPolicyName: PropTypes.string.isRequired,
    errors: PropTypes.object.isRequired,
    bootstrapEnabled: PropTypes.bool.isRequired,
    indexName: PropTypes.string.isRequired,
    aliasName: PropTypes.string.isRequired,
    originalPolicyName: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      isShowingErrors: false,
      isShowingNodeDetailsFlyout: false,
      selectedNodeAttrsForDetails: undefined,
    };
  }

  validate = async () => {
    await this.props.validate();
    const noErrors = !hasErrors(this.props.errors);
    return noErrors;
  };
  componentDidMount() {
    window.scrollTo(0, 0);
  }
  submit = async () => {
    this.setState({ isShowingErrors: true });
    if (await this.validate()) {
      this.props.done();
    } else {
      toastNotifications.addDanger('Please fix errors on the page.');
    }
  };

  showNodeDetailsFlyout = selectedNodeAttrsForDetails => {
    this.setState({ isShowingNodeDetailsFlyout: true, selectedNodeAttrsForDetails });
  }

  render() {
    const {
      back,

      selectedPolicyName,
      isSelectedPolicySet,
      errors,
      unsetSelectedPolicy,
      hasExistingPolicies
    } = this.props;

    const { isShowingErrors } = this.state;

    if (!isSelectedPolicySet) {
      return (
        <PolicySelection/>
      );
    }

    return (
      <div className="euiAnimateContentLoad">
        <PolicySelection/>
        <EuiHorizontalRule className="ilmHrule" />
        <EuiFlexGroup>
          <EuiFlexItem>
            <EuiTitle>
              <h4>
                {!selectedPolicyName ? 'Create a lifecycle policy' : `Edit lifecycle policy ${selectedPolicyName}`}
              </h4>
            </EuiTitle>
          </EuiFlexItem>
          {hasExistingPolicies ? (
            <EuiFlexItem grow={false}>
              <EuiButton size="s" onClick={unsetSelectedPolicy}>Change lifecycle policy</EuiButton>
            </EuiFlexItem>
          ) : null}
        </EuiFlexGroup>
        <EuiSpacer size="xs" />
        <EuiTitle size="xs">
          <h5>Configure the phases of your data and when to transition between them.  Only the hot phase is required.</h5>
        </EuiTitle>
        <EuiHorizontalRule className="ilmHrule" />
        <HotPhase
          validate={this.validate}
          errors={errors[PHASE_HOT]}
          isShowingErrors={isShowingErrors && hasErrors(errors[PHASE_HOT])}
        />
        <EuiHorizontalRule className="ilmHrule" />
        <WarmPhase
          validate={this.validate}
          errors={errors[PHASE_WARM]}
          showNodeDetailsFlyout={this.showNodeDetailsFlyout}
          isShowingErrors={isShowingErrors && hasErrors(errors[PHASE_WARM])}
        />
        <EuiHorizontalRule className="ilmHrule" />
        <ColdPhase
          validate={this.validate}
          errors={errors[PHASE_COLD]}
          showNodeDetailsFlyout={this.showNodeDetailsFlyout}
          isShowingErrors={isShowingErrors && hasErrors(errors[PHASE_COLD])}
        />
        <EuiHorizontalRule className="ilmHrule" />
        <DeletePhase
          validate={this.validate}
          errors={errors[PHASE_DELETE]}
          isShowingErrors={isShowingErrors && hasErrors(errors[PHASE_DELETE])}
        />
        <EuiHorizontalRule className="ilmHrule" />

        <EuiButtonEmpty
          iconSide="left"
          iconType="sortLeft"
          onClick={back}
        >
          Back
        </EuiButtonEmpty>
        &nbsp;&nbsp;
        <EuiButton
          fill
          iconSide="right"
          iconType="sortRight"
          onClick={this.submit}
        >
          Next
        </EuiButton>

        {this.state.isShowingNodeDetailsFlyout ? (
          <NodeAttrsDetails
            selectedNodeAttrs={this.state.selectedNodeAttrsForDetails}
            close={() => this.setState({ isShowingNodeDetailsFlyout: false })}
          />
        ) : null}
      </div>
    );
  }
}
