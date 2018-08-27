/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import {
  PHASE_ENABLED,
  PHASE_ROLLOVER_ENABLED,
  PHASE_ROLLOVER_AFTER,
  PHASE_ROLLOVER_AFTER_UNITS,
  PHASE_ROLLOVER_ALIAS,
} from '../constants';

export const defaultDeletePhase = {
  [PHASE_ENABLED]: false,
  [PHASE_ROLLOVER_ENABLED]: false,
  [PHASE_ROLLOVER_ALIAS]: '',
  [PHASE_ROLLOVER_AFTER]: '',
  [PHASE_ROLLOVER_AFTER_UNITS]: 's'
};