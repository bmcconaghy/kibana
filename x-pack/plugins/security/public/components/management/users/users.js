/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { Component, Fragment } from 'react';
import { EuiCallOut, EuiButton, EuiIcon, EuiLink, EuiInMemoryTable, EuiPage } from '@elastic/eui';
import { toastNotifications } from 'ui/notify';
import { ConfirmDelete } from './confirm_delete';

export class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      selection: [],
      showDeleteConfirmation: false,
    };
  }
  componentDidMount() {
    this.loadUsers();
  }
  handleDelete = (usernames, errors) => {
    const { users } = this.state;
    this.setState({
      selection: [],
      showDeleteConfirmation: false,
      users: users.filter(({ username }) => {
        return !usernames.includes(username) || errors.includes(username);
      }),
    });
  };
  async loadUsers() {
    const { apiClient, changeUrl } = this.props;
    try {
      const users = await apiClient.getUsers();
      this.setState({ users });
    } catch (e) {
      if (e.status === 403) {
        this.setState({ permissionDenied: true });
        setTimeout(() => {
          changeUrl('/management');
        }, 3000);
      } else {
        toastNotifications.addDanger(`Error fetching users: ${e.data.message}`);
      }
    }
  }
  renderToolsRight() {
    const { selection } = this.state;
    if (selection.length === 0) {
      return (
        <EuiButton
          data-test-subj="createUserButton"
          href="#/management/security/users/edit"
          fill
          iconType="plusInCircle"
        >
          Create user
        </EuiButton>
      );
    }

    const numSelected = selection.length;
    return (
      <EuiButton
        data-test-subj="deleteUserButton"
        color="danger"
        iconType="trash"
        onClick={() => this.setState({ showDeleteConfirmation: true })}
      >
        Delete {numSelected} user{numSelected > 1 ? 's' : ''}
      </EuiButton>
    );
  }
  onCancelDelete = () => {
    this.setState({ showDeleteConfirmation: false });
  }
  render() {
    const { users, permissionDenied, showDeleteConfirmation, selection } = this.state;
    const { apiClient } = this.props;
    if (permissionDenied) {
      return (
        <EuiCallOut title="Permission denied" color="danger" iconType="cross">
          <p data-test-subj="permissionDeniedMessage">
            You do not have permission to manage users.
          </p>
        </EuiCallOut>
      );
    }
    const path = '#/management/security/';
    const columns = [
      {
        field: 'full_name',
        name: 'Full Name',
        sortable: true,
        truncateText: true,
        render: fullName => {
          return <div data-test-subj="userRowFullName">{fullName}</div>;
        },
      },
      {
        field: 'username',
        name: 'User Name',
        sortable: true,
        truncateText: true,
        render: username => (
          <EuiLink data-test-subj="userRowUserName" href={`${path}users/edit/${username}`}>
            {username}
          </EuiLink>
        ),
      },
      {
        field: 'roles',
        name: 'Roles',
        render: rolenames => {
          const roleLinks = rolenames.map((rolename, index) => {
            return (
              <Fragment key={rolename}>
                <EuiLink href={`${path}roles/edit/${rolename}`}>{rolename}</EuiLink>
                {index === rolenames.length - 1 ? null : ', '}
              </Fragment>
            );
          });
          return <div data-test-subj="userRowRoles">{roleLinks}</div>;
        },
      },
      {
        field: 'metadata._reserved',
        name: 'Reserved',
        sortable: false,
        render: reserved =>
          reserved ? <EuiIcon data-test-subj="reservedUser" type="check" /> : null,
      },
    ];
    const pagination = {
      initialPageSize: 20,
      pageSizeOptions: [10, 20, 50, 100],
    };

    const selectionConfig = {
      itemId: 'username',
      selectable: user => !user.metadata._reserved,
      selectableMessage: selectable => (!selectable ? 'User is a system user' : undefined),
      onSelectionChange: selection => this.setState({ selection }),
    };
    const search = {
      toolsRight: this.renderToolsRight(),
      box: {
        incremental: true,
      },
    };
    const sorting = {
      sort: {
        field: 'full_name',
        direction: 'asc',
      },
    };
    const rowProps = () => {
      return {
        'data-test-subj': 'userRow',
      };
    };
    return (
      <EuiPage>
        {showDeleteConfirmation ? (
          <ConfirmDelete
            onCancel={this.onCancelDelete}
            apiClient={apiClient}
            usersToDelete={selection.map((user) => user.username)}
            callback={this.handleDelete}
          />
        ) : null}
        <EuiInMemoryTable
          itemId="username"
          columns={columns}
          selection={selectionConfig}
          pagination={pagination}
          items={users}
          loading={users.length === 0}
          search={search}
          sorting={sorting}
          rowProps={rowProps}
        />
      </EuiPage>
    );
  }
}
