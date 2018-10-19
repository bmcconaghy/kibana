/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import {
  EuiInMemoryTable,
  EuiEmptyPrompt,
} from '@elastic/eui';

export class FieldList extends Component {
  constructor() {
    super();
    this.state = {
      pageIndex: null
    };
  }
  onTableChange = ({ page: { index: pageIndex } }) => {
    this.setState({ pageIndex });
  }
  componentDidUpdate() {
    const { pageIndex } = this.state;
    if (this.table && pageIndex) {
      this.table.setState({ pageIndex });
    }
  }
  render() {
    const {
      columns,
      fields,
      onRemoveField,
      addButton,
      emptyMessage,
    } = this.props;
    let message;

    if (!fields.length) {
      message = (
        <EuiEmptyPrompt
          title={emptyMessage}
          titleSize="xs"
        />
      );
    }

    let extendedColumns;

    if (onRemoveField) {
      extendedColumns = columns.concat({
        name: 'Remove',
        width: '80px',
        actions: [{
          name: 'Remove',
          isPrimary: true,
          description: 'Remove this field',
          icon: 'trash',
          type: 'icon',
          color: 'danger',
          onClick: (field) => onRemoveField(field),
        }]
      });
    } else {
      extendedColumns = columns;
    }

    const search = {
      toolsRight: addButton ? addButton : undefined,
      box: {
        incremental: true,
      },
    };

    const pagination = {
      initialPageSize: 200,
      pageSizeOptions: [20, 100, 200]
    };

    return (
      <Fragment>
        <EuiInMemoryTable
          items={fields}
          itemId="name"
          columns={extendedColumns}
          search={search}
          pagination={pagination}
          sorting={true}
          message={message}
          onTableChange={this.onTableChange}
          ref={(table) => { this.table = table; }}
        />
      </Fragment>
    );
  }

  static propTypes = {
    columns: PropTypes.array.isRequired,
    fields: PropTypes.array.isRequired,
    onRemoveField: PropTypes.func,
    addButton: PropTypes.node,
    emptyMessage: PropTypes.node,
  }
}
