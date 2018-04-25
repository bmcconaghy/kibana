/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { get, find } from 'lodash';
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import chrome from 'ui/chrome';
import { formatDateTimeLocal } from '../../../common/formatting';
import { MANAGEMENT_BASE_PATH } from 'plugins/xpack_main/components';
import { License } from 'plugins/monitoring/components';

const REACT_NODE_ID = 'licenseReact';

export class LicenseViewController {
  constructor($injector, $scope) {
    const timefilter = $injector.get('timefilter');
    timefilter.disableTimeRangeSelector();
    timefilter.disableAutoRefreshSelector();

    $scope.$on('$destroy', () => {
      unmountComponentAtNode(document.getElementById(REACT_NODE_ID));
    });

    this.init($injector, $scope);
  }

  init($injector, $scope) {
    const globalState = $injector.get('globalState');
    const title = $injector.get('title');
    const $route = $injector.get('$route');

    const cluster = find($route.current.locals.clusters, { cluster_uuid: globalState.cluster_uuid });
    $scope.cluster = cluster;
    title($scope.cluster, 'License');

    this.license = cluster.license;
    this.isExpired = Date.now() > get(cluster, 'license.expiry_date_in_millis');
    this.isPrimaryCluster = cluster.isPrimary;

    const basePath = chrome.getBasePath();
    this.uploadLicensePath = basePath + '/app/kibana#' + MANAGEMENT_BASE_PATH + 'upload_license';

    this.renderReact($scope);
  }

  renderReact($scope) {
    $scope.$evalAsync(() => {
      const { isPrimaryCluster, license, isExpired, uploadLicensePath } = this;
      let expiryDate = license.expiry_date;
      if (license.expiry_date !== undefined) {
        expiryDate = formatDateTimeLocal(license.expiry_date);
      }

      // Mount the React component to the template
      render(
        <License
          isPrimaryCluster={isPrimaryCluster}
          status={license.status}
          type={license.type}
          isExpired={isExpired}
          expiryDate={expiryDate}
          uploadLicensePath={uploadLicensePath}
        />,
        document.getElementById(REACT_NODE_ID)
      );
    });
  }
}
