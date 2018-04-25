import _ from 'lodash';

export default class Api {
  constructor(name) {
    this.globalRules = {};
    this.endpoints = {};
    this.name = name;
  }
  addGlobalAutocompleteRules = function (parentNode, rules) {
    this.globalRules[parentNode] = rules;
  }
  addEndpointDescription(endpoint, description = {}) {
    let copiedDescription = {};
    if (this.endpoints[endpoint]) {
      console.warn(`Extending endpoint definition: ${endpoint}`);
      copiedDescription = { ...this.endpoints[endpoint] };
    }

    const urlParamsDef = {};
    _.each(description.patterns || [], function (p) {
      if (p.indexOf('{indices}') >= 0) {
        urlParamsDef.ignore_unavailable = '__flag__';
        urlParamsDef.allow_no_indices = '__flag__';
        urlParamsDef  .expand_wildcards = ['open', 'closed'];
      }
    });

    if (urlParamsDef) {
      description.url_params = description.url_params || {};
      _.defaults(description.url_params, urlParamsDef);
    }

    _.extend(copiedDescription, description);
    _.defaults(copiedDescription, {
      id: endpoint,
      patterns: [endpoint],
      methods: ['GET']
    });
    this.endpoints[endpoint] = copiedDescription;
  }

  asJson() {
    return {
      'name': this.name,
      'globals': this.globalRules,
      'endpoints': this.endpoints
    };
  }

}
