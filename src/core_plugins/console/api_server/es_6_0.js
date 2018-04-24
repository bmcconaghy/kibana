import  _ from 'lodash';
import Api from './api';
import { getSpec } from './spec';
import { customApiDefinitions } from './es_6_0_custom';

const ES_6_0 = new Api('es_6_0');

const spec = getSpec();
Object.keys(spec).forEach(endpoint => {
  ES_6_0.addEndpointDescription(endpoint, spec[endpoint]);
});

/*
   These parts sometimes add to the definition that comes from the spec.
   That is often how request bodies are filled in as those are not in REST specs.
*/
_.each(customApiDefinitions, function (apiSection) {
  apiSection(ES_6_0);
});

export default ES_6_0;
