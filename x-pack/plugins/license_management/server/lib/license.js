/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

const getLicensePath = (acknowledge) => `/_xpack/license${ acknowledge ? '?acknowledge=true' : ''}`;

export async function putLicense(req, xpackInfo) {
  const { acknowledge } = req.query;
  const { callWithRequest } = req.server.plugins.elasticsearch.getCluster('admin');
  const options = {
    method: 'POST',
    path: getLicensePath(acknowledge),
    body: req.payload
  };
  let response;
  try {
    response = await callWithRequest(req, 'transport.request', options);
  } catch (error) {
    return error.body;
  }
  const { acknowledged, license_status: licenseStatus } = response;
  if (acknowledged && licenseStatus === 'valid') {
    try {
      await xpackInfo.refreshNow();
    } catch (error) {
      console.warn('Issue refreshing xpack info after applying license', error);
    }
  }
  return response;

}
