/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { Component } from 'react';
import { i18n }  from '@kbn/i18n';
import { FormattedMessage, injectI18n } from '@kbn/i18n/react';
import { NoMatch } from '../no_match';
import {
  EuiLink,
  EuiCheckbox,
  EuiFieldSearch,
  EuiFlexGroup,
  EuiFlexItem,
  EuiPage,
  EuiSpacer,
  EuiTable,
  EuiTableBody,
  EuiTableHeader,
  EuiTableHeaderCell,
  EuiTableHeaderCellCheckbox,
  EuiTablePagination,
  EuiTableRow,
  EuiTableRowCell,
  EuiTableRowCellCheckbox,
  EuiTitle,
  EuiText,
  EuiPageBody,
  EuiPageContent
} from '@elastic/eui';

const HEADERS = {
  name: i18n.translate('xpack.indexLifecycleMgmt.policyTable.headers.nameHeader', {
    defaultMessage: 'Name',
  }),
  coveredIndices: i18n.translate('xpack.indexLifecycleMgmt.policyTable.headers.coveredIndicesHeader', {
    defaultMessage: 'Covered Indices',
  }),
};

export class PolicyTableUi extends Component {
  static getDerivedStateFromProps(props, state) {
    // Deselect any policies which no longer exist, e.g. they've been deleted.
    const { selectedPoliciesMap } = state;
    const policyNames = props.policies.map(policy => policy.name);
    const selectedPolicyNames = Object.keys(selectedPoliciesMap);
    const missingPolicyNames = selectedPolicyNames.filter(selectedpolicyName => {
      return !policyNames.includes(selectedpolicyName);
    });

    if (missingPolicyNames.length) {
      const newMap = { ...selectedPoliciesMap };
      missingPolicyNames.forEach(missingPolicyName => delete newMap[missingPolicyName]);
      return { selectedPoliciesMap: newMap };
    }

    return null;
  }

  constructor(props) {
    super(props);

    this.state = {
      selectedPoliciesMap: {}
    };
  }
  componentDidMount() {
    this.props.fetchPolicies(true);
  }
  onSort = column => {
    const { sortField, isSortAscending, sortChanged } = this.props;

    const newIsSortAscending = sortField === column ? !isSortAscending : true;
    sortChanged(column, newIsSortAscending);
  };

  toggleAll = () => {
    const allSelected = this.areAllItemsSelected();
    if (allSelected) {
      return this.setState({ selectedPoliciesMap: {} });
    }
    const { policies } = this.props;
    const selectedPoliciesMap = {};
    policies.forEach(({ name }) => {
      selectedPoliciesMap[name] = true;
    });
    this.setState({
      selectedPoliciesMap
    });
  };

  toggleItem = name => {
    this.setState(({ selectedPoliciesMap }) => {
      const newMap = { ...selectedPoliciesMap };
      if (newMap[name]) {
        delete newMap[name];
      } else {
        newMap[name] = true;
      }
      return {
        selectedPoliciesMap: newMap
      };
    });
  };

  isItemSelected = name => {
    return !!this.state.selectedPoliciesMap[name];
  };

  areAllItemsSelected = () => {
    const { policies } = this.props;
    const policyOfUnselectedItem = policies.find(
      policy => !this.isItemSelected(policy.name)
    );
    return policyOfUnselectedItem === -1;
  };

  buildHeader() {
    const { sortField, isSortAscending } = this.props;
    return Object.entries(HEADERS).map(([fieldName, label]) => {
      const isSorted = sortField === fieldName;
      return (
        <EuiTableHeaderCell
          key={fieldName}
          onSort={() => this.onSort(fieldName)}
          isSorted={isSorted}
          isSortAscending={isSortAscending}
          data-test-subj={`policyTableHeaderCell-${fieldName}`}
          className={'policyTable__header--' + fieldName}
        >
          {label}
        </EuiTableHeaderCell>
      );
    });
  }

  buildRowCell(fieldName, value) {
    if (fieldName === 'name') {
      return (
        <EuiLink
          className="policyTable__link"
          data-test-subj="policyTablePolicyNameLink"
          onClick={() => {

          }}
        >
          {value}
        </EuiLink>
      );
    }
    return value;
  }

  buildRowCells(policy) {
    return Object.keys(HEADERS).map(fieldName => {
      const { name } = policy;
      const value = policy[fieldName];
      return (
        <EuiTableRowCell
          key={`${fieldName}-${name}`}
          truncateText={false}
          data-test-subj={`policyTableCell-${fieldName}`}
        >
          {this.buildRowCell(fieldName, value)}
        </EuiTableRowCell>
      );
    });
  }

  buildRows() {
    const { policies = [], detailPanelpolicyName } = this.props;
    return policies.map(policy => {
      const { name } = policy;
      return (
        <EuiTableRow
          isSelected={
            this.isItemSelected(name) || name === detailPanelpolicyName
          }
          key={`${name}-row`}
        >
          <EuiTableRowCellCheckbox key={`checkbox-${name}`}>
            <EuiCheckbox
              type="inList"
              id={`checkboxSelectpolicy-${name}`}
              checked={this.isItemSelected(name)}
              onChange={() => {
                this.toggleItem(name);
              }}
              data-test-subj="policyTableRowCheckbox"
            />
          </EuiTableRowCellCheckbox>
          {this.buildRowCells(policy)}
        </EuiTableRow>
      );
    });
  }

  renderPager() {
    const { pager, pageChanged, pageSizeChanged } = this.props;
    return (
      <EuiTablePagination
        activePage={pager.getCurrentPageIndex()}
        itemsPerPage={pager.itemsPerPage}
        itemsPerPageOptions={[10, 50, 100]}
        pageCount={pager.getTotalPages()}
        onChangeItemsPerPage={pageSizeChanged}
        onChangePage={pageChanged}
      />
    );
  }

  onItemSelectionChanged = selectedPolicies => {
    this.setState({ selectedPolicies });
  };

  render() {
    const {
      filterChanged,
      filter,
      policies,
      intl,
    } = this.props;

    return (
      <EuiPage>
        <EuiPageBody>
          <EuiPageContent>
            <EuiFlexGroup justifyContent="spaceBetween" alignItems="flexEnd">
              <EuiFlexItem grow={false}>
                <EuiTitle size="l">
                  <h1>
                    <FormattedMessage
                      id="xpack.indexLifecycleMgmt.policyTable.sectionHeading"
                      defaultMessage="Policy management"
                    />
                  </h1>
                </EuiTitle>
                <EuiSpacer size="s" />
                <EuiText>
                  <p>
                    <FormattedMessage
                      id="xpack.indexLifecycleMgmt.policyTable.sectionDescription"
                      defaultMessage="Update your index lifecycle policies individually or in bulk"
                    />
                  </p>
                </EuiText>
              </EuiFlexItem>
            </EuiFlexGroup>
            <EuiSpacer />
            <EuiFlexGroup gutterSize="l" alignItems="center">
              <EuiFlexItem>
                <EuiFieldSearch
                  fullWidth
                  value={filter}
                  onChange={event => {
                    filterChanged(event.target.value);
                  }}
                  data-test-subj="policyTableFilterInput"
                  placeholder={
                    intl.formatMessage({
                      id: 'xpack.indexLifecycleMgmt.policyTable.systempoliciesSearchInputPlaceholder',
                      defaultMessage: 'Search',
                    })
                  }
                  aria-label="Search policies"
                />
              </EuiFlexItem>
            </EuiFlexGroup>

            <EuiSpacer size="m" />

            {policies.length > 0 ? (
              <EuiTable>
                <EuiTableHeader>
                  <EuiTableHeaderCellCheckbox>
                    <EuiCheckbox
                      id="selectAllpolicyes"
                      checked={this.areAllItemsSelected()}
                      onChange={this.toggleAll}
                      type="inList"
                    />
                  </EuiTableHeaderCellCheckbox>
                  {this.buildHeader()}
                </EuiTableHeader>
                <EuiTableBody>{this.buildRows()}</EuiTableBody>
              </EuiTable>
            ) : (
              <NoMatch />
            )}
            <EuiSpacer size="m" />
            {policies.length > 0 ? this.renderPager() : null}
          </EuiPageContent>
        </EuiPageBody>
      </EuiPage>
    );
  }
}

export const PolicyTable = injectI18n(PolicyTableUi);
