const $ = require('jquery');
const _ = require('lodash');
const mappings = require('./mappings');
const Api = require('./kb/api');
const autocompleteEngine = require('./autocomplete/engine');

let ACTIVE_API = new Api();

function nonValidIndexType(token) {
  return !(token === '_all' || token[0] !== '_');
}

class IndexAutocompleteComponent extends autocompleteEngine.ListComponent {
  constructor(name, parent, multiValued) {
    super(name, mappings.getIndices, parent, multiValued);
  }
  validateTokens(tokens) {
    if (!this.multi_valued && tokens.length > 1) {
      return false;
    }
    return !_.find(tokens, nonValidIndexType);
  }

  getDefaultTermMeta() {
    return 'index';
  }

  getContextKey() {
    return 'indices';
  }
}




function TypeGenerator(context) {
  return mappings.getTypes(context.indices);
}

class TypeAutocompleteComponent extends autocompleteEngine.ListComponent {
  constructor(name, parent, multiValued) {
    super(name, TypeGenerator, parent, multiValued);
  }
  validateTokens(tokens) {
    if (!this.multi_valued && tokens.length > 1) {
      return false;
    }

    return !_.find(tokens, nonValidIndexType);
  }

  getDefaultTermMeta() {
    return 'type';
  }

  getContextKey() {
    return 'types';
  }
}



function FieldGenerator(context) {
  return _.map(mappings.getFields(context.indices, context.types), function (field) {
    return { name: field.name, meta: field.type };
  });
}

class FieldAutocompleteComponent extends autocompleteEngine.ListComponent {
  constructor(name, parent, multiValued)  {
    super(name, FieldGenerator, parent, multiValued);
  }
  validateTokens(tokens) {
    if (!this.multi_valued && tokens.length > 1) {
      return false;
    }

    return !_.find(tokens, function (token) {
      return token.match(/[^\w.?*]/);
    });
  }

  getDefaultTermMeta() {
    return 'field';
  }

  getContextKey() {
    return 'fields';
  }
}



class IdAutocompleteComponent extends autocompleteEngine.SharedComponent {
  constructor(name, parent, multi) {
    super(name, parent);
    this.multiMatch = multi;
  }
  match(token, context, editor) {
    if (!token) {
      return null;
    }
    if (!this.multi_match && Array.isArray(token)) {
      return null;
    }
    token = Array.isArray(token) ? token : [token];
    if (_.find(token, function (t) {
      return t.match(/[\/,]/);
    })) {
      return null;
    }
    const r = this.match(token, context, editor);
    r.context_values = r.context_values || {};
    r.context_values.id = token;
    return r;
  }
}

const parametrizedComponentFactories = {

  'index': function (name, parent) {
    return new IndexAutocompleteComponent(name, parent, false);
  },
  'indices': function (name, parent) {
    return new IndexAutocompleteComponent(name, parent, true);
  },
  'type': function (name, parent) {
    return new TypeAutocompleteComponent(name, parent, false);
  },
  'types': function (name, parent) {
    return new TypeAutocompleteComponent(name, parent, true);
  },
  'id': function (name, parent) {
    return new IdAutocompleteComponent(name, parent);
  },
  'ids': function (name, parent) {
    return new IdAutocompleteComponent(name, parent, true);
  },
  'fields': function (name, parent) {
    return new FieldAutocompleteComponent(name, parent, true);
  },
  'field': function (name, parent) {
    return new FieldAutocompleteComponent(name, parent, false);
  },
  'nodes': function (name, parent) {
    return new autocompleteEngine.ListComponent(name, ['_local', '_master', 'data:true', 'data:false',
      'master:true', 'master:false'], parent);
  },
  'node': function (name, parent) {
    return new autocompleteEngine.ListComponent(name, [], parent, false);
  }
};

export function getUnmatchedEndpointComponents() {
  return ACTIVE_API.getUnmatchedEndpointComponents();
}

export function getEndpointDescriptionByEndpoint(endpoint) {
  return ACTIVE_API.getEndpointDescriptionByEndpoint(endpoint);
}

export function getEndpointBodyCompleteComponents(endpoint) {
  const desc = getEndpointDescriptionByEndpoint(endpoint);
  if (!desc) {
    throw new Error('failed to resolve endpoint [\'' + endpoint + '\']');
  }
  return desc.bodyAutocompleteRootComponents;
}

export function getTopLevelUrlCompleteComponents() {
  return ACTIVE_API.getTopLevelUrlCompleteComponents();
}

export function getGlobalAutocompleteComponents(term, throwOnMissing) {
  return ACTIVE_API.getGlobalAutocompleteComponents(term, throwOnMissing);
}

function loadApisFromJson(json, urlParametrizedComponentFactories, bodyParametrizedComponentFactories) {
  urlParametrizedComponentFactories = urlParametrizedComponentFactories || parametrizedComponentFactories;
  bodyParametrizedComponentFactories = bodyParametrizedComponentFactories || urlParametrizedComponentFactories;
  const api = new Api(urlParametrizedComponentFactories, bodyParametrizedComponentFactories);
  const names = [];
  _.each(json, function (apiJson, name) {
    names.unshift(name);
    _.each(apiJson.globals || {}, function (globalJson, globalName) {
      api.addGlobalAutocompleteRules(globalName, globalJson);
    });
    _.each(apiJson.endpoints || {}, function (endpointJson, endpointName) {
      api.addEndpointDescription(endpointName, endpointJson);
    });
  });
  api.name = names.join(',');
  return api;
}

export function setActiveApi(api) {
  if (_.isString(api)) {
    $.ajax({
      url: '../api/console/api_server?sense_version=' + encodeURIComponent('@@SENSE_VERSION') + '&apis=' + encodeURIComponent(api),
      dataType: 'json', // disable automatic guessing
    }
    ).then(
      function (data) {
        setActiveApi(loadApisFromJson(data));
      },
      function (jqXHR) {
        console.log('failed to load API \'' + api + '\': ' + jqXHR.responseText);
      });
    return;

  }
  console.log('setting active api to [' + api.name + ']');

  ACTIVE_API = api;
}

setActiveApi('es_6_0');

export const _test = {
  loadApisFromJson: loadApisFromJson
};
