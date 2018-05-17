/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  EuiFlexGrid,
  EuiFlexGroup,
  EuiFlexItem,
  EuiIcon,
  EuiTitle,
  EuiSpacer,
  EuiPanel,
  EuiText,
} from '@elastic/eui';

export class PolicySelection extends Component {
  static propTypes = {
    fetchPolicies: PropTypes.func.isRequired,
    setSelectedPolicy: PropTypes.func.isRequired,
    // done: PropTypes.func.isRequired,
    // back: PropTypes.func.isRequired,

    existingPolicyName: PropTypes.string.isRequired,
    policies: PropTypes.array.isRequired
  };

  componentWillMount() {
    this.props.fetchPolicies();
  }

  selectPolicy(policyName) {
    const policy = this.props.policies.find(policy => policy.name === policyName);
    this.props.setSelectedPolicy(policy);
    // this.props.done();
  }

  render() {
    const { policies, existingPolicyName } = this.props;

    const options = policies.map(item => ({ value: item.name, text: item.name }));
    options.unshift({
      value: '',
      text: '-- New Policy --'
    });

    return (
      <EuiDescribedFormGroup
        title={<h4>Select or create a policy</h4>}
        titleSize="s"
        description="An index lifecycle policy is a
          blueprint for transitioning your data over time.
          You can create a new policy or edit an existing
          policy and save it with a new name."
        fullWidth
      >
        <EuiFlexGroup alignItems="center">
          <EuiFlexItem>
            <EuiFormRow label="Existing policies">
              <EuiSelect
                options={options}
                value={existingPolicyName}
                onChange={async e => {
                  await this.selectPolicy(e.target.value);
                }}
              />
            </EuiFormRow>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiFormRow hasEmptyLabelSpace>
              <EuiButton
                onClick={() => this.selectPolicy()}
              >
                Create new policy
              </EuiButton>
            </EuiFormRow>
          </EuiFlexItem>
        </EuiFlexGroup>
        <EuiSpacer />
        <EuiFlexGrid columns={4}>
          <EuiFlexItem>
            <EuiPanel
              style={{ textAlign: 'center' }}
              onClick={() => this.selectPolicy(null)}
            >
              <EuiIcon type="plusInCircle" />
              <EuiTitle size="s">
                <p>New policy</p>
              </EuiTitle>
            </EuiPanel>
          </EuiFlexItem>
          {policies.map(item => (
            <EuiFlexItem key={item.name}>
              <EuiPanel
                style={{ textAlign: 'center' }}
                onClick={() => this.selectPolicy(item)}
              >
                <EuiTitle size="s">
                  <p>
                    {item.name}
                    {existingPolicyName === item.name ? '*' : ''}
                  </p>
                </EuiTitle>
              </EuiPanel>
            </EuiFlexItem>
          ))}
        </EuiFlexGrid>
        {/* <EuiHorizontalRule className="ilmHrule" /> */}

        {/* <EuiButtonEmpty
          iconSide="left"
          iconType="sortLeft"
          onClick={back}
        >
          Back
        </EuiButtonEmpty> */}
      </div>
    );
  }
}
