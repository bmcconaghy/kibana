/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';

import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiTitle,
  EuiSpacer,
  EuiSelect,
  EuiFieldNumber,
  EuiHorizontalRule,
  EuiCallOut,
  EuiButtonEmpty,
  EuiDescribedFormGroup,
} from '@elastic/eui';
import { LearnMoreLink } from '../../../../../../components/learn_more_link';
import {
  STRUCTURE_NODE_ATTRS,
  STRUCTURE_PRIMARY_NODES,
  STRUCTURE_REPLICAS,
} from '../../../../../../store/constants';

import { ErrableFormRow } from '../../../../form_errors';
import { NodeAttrsDetails } from '../../../node_attrs_details';

export class Configuration extends Component {
  static propTypes = {
    fetchNodes: PropTypes.func.isRequired,
    setSelectedNodeAttrs: PropTypes.func.isRequired,
    setSelectedPrimaryShardCount: PropTypes.func.isRequired,
    setSelectedReplicaCount: PropTypes.func.isRequired,
    validate: PropTypes.func.isRequired,

    selectedPrimaryShardCount: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]).isRequired,
    selectedNodeAttrs: PropTypes.string.isRequired,
    nodeOptions: PropTypes.array.isRequired,
    selectedReplicaCount: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]).isRequired,
    isShowingErrors: PropTypes.bool.isRequired,
    errors: PropTypes.object.isRequired,
    isPrimaryShardCountHigherThanSelectedNodeAttrsCount:
      PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isShowingNodeDetailsFlyout: false,
    };
  }

  componentWillMount() {
    this.props.fetchNodes();
  }

  render() {
    const {
      setSelectedNodeAttrs,
      setSelectedPrimaryShardCount,
      setSelectedReplicaCount,
      validate,

      nodeOptions,
      selectedPrimaryShardCount,
      selectedReplicaCount,
      selectedNodeAttrs,
      errors,
      isShowingErrors,
      isPrimaryShardCountHigherThanSelectedNodeAttrsCount,
    } = this.props;

    const primaryNodeErrors = isPrimaryShardCountHigherThanSelectedNodeAttrsCount ? (
      <EuiCallOut
        style={{ marginTop: '1rem' }}
        title="Primary shard count is too high"
        color="warning"
        iconType="help"
      >
        The shard count should be lower than the number of nodes that match the selected attributes.
      </EuiCallOut>
    ) : null;

    return (
      <div>
        <EuiHorizontalRule className="ilmHrule" />
        <EuiTitle>
          <h4>Configure options</h4>
        </EuiTitle>
        <EuiSpacer size="l" />
        <ErrableFormRow
          label={
            <Fragment>
              <span>Where do you want your hot indices to live</span>
              &nbsp;
              <EuiIconTip
                content="Hot indices are indices in active writing mode."
                position="right"
              />
            </Fragment>
          }
          errorKey={STRUCTURE_NODE_ATTRS}
          isShowingErrors={isShowingErrors}
          errors={errors}
          helpText={selectedNodeAttrs ? (
            <EuiButtonEmpty
              flush="left"
              onClick={() =>
                this.setState({ isShowingNodeDetailsFlyout: true })
              }
            >
              View node details
            </EuiButtonEmpty>
          ) : null}
        >
          <ErrableFormRow
            label="Where do you want your hot indices to live?"
            errorKey={STRUCTURE_NODE_ATTRS}
            isShowingErrors={isShowingErrors}
            errors={errors}
            helpText={selectedNodeAttrs ? (
              <EuiButtonEmpty
                flush="left"
                iconType="eye"
                onClick={() =>
                  this.setState({ isShowingNodeDetailsFlyout: true })
                }
              >
                View a list of nodes attached to this configuration
              </EuiButtonEmpty>
            ) : null}
          >
            <EuiSelect
              value={selectedNodeAttrs}
              onChange={async e => {
                await setSelectedNodeAttrs(e.target.value);
                validate();
              }}
              options={nodeOptions}
            />
          </ErrableFormRow>
          <EuiCallOut
            color="warning"
            size="s"
            title={
              <p>
                The best way to determine how many shards you need is to benchmark
                using realistic data and queries on your hardware.{' '}
                <LearnMoreLink
                  href="https://www.elastic.co/webinars/using-rally-to-get-your-elasticsearch-cluster-size-right"
                />
              </p>
            }
          />
        </ErrableFormRow>
        <EuiCallOut title="Tip">
          <p>
            The best way to determine how many shards you need is to benchmark
            using realistic data and queries on your hardware.{' '}
            <EuiLink href="https://www.elastic.co/webinars/using-rally-to-get-your-elasticsearch-cluster-size-right">
              Learn more.
            </EuiLink>
          </p>
        </EuiCallOut>
        <EuiSpacer />
        <EuiFlexGroup>
          <EuiFlexItem style={{ maxWidth: 188 }}>
            <ErrableFormRow
              label="Primary shards"
              errorKey={STRUCTURE_PRIMARY_NODES}
              isShowingErrors={isShowingErrors}
              errors={errors}
            >
              <EuiFieldNumber
                onChange={async e => {
                  await setSelectedPrimaryShardCount(e.target.value);
                  validate();
                }}
                value={selectedPrimaryShardCount}
              />
            </ErrableFormRow>
          </EuiFlexItem>
          <EuiFlexItem style={{ maxWidth: 188 }}>
            <ErrableFormRow
              label="Replicas"
              errorKey={STRUCTURE_REPLICAS}
              isShowingErrors={isShowingErrors}
              errors={errors}
            >
              <EuiFieldNumber
                onChange={async e => {
                  await setSelectedReplicaCount(e.target.value);
                  validate();
                }}
                value={selectedReplicaCount}
              />
            </ErrableFormRow>
          </EuiFlexItem>
        </EuiFlexGroup>
        {this.state.isShowingNodeDetailsFlyout ? (
          <NodeAttrsDetails
            selectedNodeAttrs={selectedNodeAttrs}
            close={() => this.setState({ isShowingNodeDetailsFlyout: false })}
          />
        ) : null}

        {primaryNodeErrors}
      </div>
    );
  }
}
