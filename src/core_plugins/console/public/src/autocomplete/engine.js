import _ from 'lodash';





export class AutocompleteComponent {
  constructor(name) {
    this.name = name;
  }

  /** called to get the possible suggestions for tokens, when this object is at the end of
 * the resolving chain (and thus can suggest possible continuation paths)
 */
  getTerms() {
    return [];
  }

  /*
  if the current matcher matches this term, this method should return an object with the following keys
  {
  context_values: {
  values extract from term that should be added to the context
  }
  next: AutocompleteComponent(s) to use next
  priority: optional priority to solve collisions between multiple paths. Min value is used across entire chain
  }
  */
  match() {
    return {
      next: this.next
    };
  }
}

export class SharedComponent extends AutocompleteComponent {
  constructor(name, parent) {
    super(name);
    AutocompleteComponent.call(this, name);
    this._nextDict = {};
    if (parent) {
      parent.addComponent(this);
    }
    // for debugging purposes
    this._parent = parent;
  }
  /* return the first component with a given name */
  getComponent(name) {
    return (this._nextDict[name] || [undefined])[0];
  }

  addComponent(component) {
    const current = this._nextDict[component.name] || [];
    current.push(component);
    this._nextDict[component.name] = current;
    this.next = [].concat.apply([], _.values(this._nextDict));
  }
}


/** A component that suggests one of the give options, but accepts anything */
export class ListComponent extends SharedComponent {
  constructor(name, list, parent, multi_valued, allow_non_valid_values) {
    super(name, parent);
    this.listGenerator = Array.isArray(list) ? function () {
      return list;
    } : list;
    this.multi_valued = _.isUndefined(multi_valued) ? true : multi_valued;
    this.allow_non_valid_values = _.isUndefined(allow_non_valid_values) ? false : allow_non_valid_values;
  }
  getTerms(context, editor) {
    if (!this.multi_valued && context.otherTokenValues) {
      // already have a value -> no suggestions
      return [];
    }
    let already_set = context.otherTokenValues || [];
    if (_.isString(already_set)) {
      already_set = [already_set];
    }
    let ret = _.difference(this.listGenerator(context, editor), already_set);

    if (this.getDefaultTermMeta()) {
      const meta = this.getDefaultTermMeta();
      ret = _.map(ret, function (term) {
        if (_.isString(term)) {
          term = { 'name': term };
        }
        return _.defaults(term, { meta: meta });
      });
    }

    return ret;
  }

  validateTokens(tokens) {
    if (!this.multi_valued && tokens.length > 1) {
      return false;
    }

    // verify we have all tokens
    const list = this.listGenerator();
    const not_found = _.any(tokens, function (token) {
      return list.indexOf(token) == -1;
    });

    if (not_found) {
      return false;
    }
    return true;
  }

  getContextKey() {
    return this.name;
  }

  getDefaultTermMeta() {
    return this.name;
  }

  match(token, context, editor) {
    if (!Array.isArray(token)) {
      token = [token];
    }
    if (!this.allow_non_valid_values && !this.validateTokens(token, context, editor)) {
      return null;
    }

    const result = super.match.call(this, token, context, editor);
    result.context_values = result.context_values || {};
    result.context_values[this.getContextKey()] = token;
    return result;
  }
}


export class SimpleParamComponent extends SharedComponent {
  match(token, context, editor) {
    const result = Object.getPrototypeOf(cls).match.call(this, token, context, editor);
    result.context_values = result.context_values || {};
    result.context_values[this.name] = token;
    return result;
  }
}

export class ConstantComponent extends SharedComponent {
  constructor(name, parent, options) {
    super(name, parent);
    if (_.isString(options)) {
      options = [options];
    }
    this.options = options || [name];
  }
  getTerms() {
    return this.options;
  }

  addOption(options) {
    if (!Array.isArray(options)) {
      options = [options];
    }

    [].push.apply(this.options, options);
    this.options = _.uniq(this.options);
  }
  match(token, context, editor) {
    if (token !== this.name) {
      return null;
    }

    return Object.getPrototypeOf(cls).match.call(this, token, context, editor);

  }
}

export function wrapComponentWithDefaults(component, defaults) {
  function Wrapper() {

  }

  Wrapper.prototype = {};
  for (const key in component) {
    if (_.isFunction(component[key])) {
      Wrapper.prototype[key] = _.bindKey(component, key);
    }
  }

  Wrapper.prototype.getTerms = function (context, editor) {
    let result = component.getTerms(context, editor);
    if (!result) {
      return result;
    }
    result = _.map(result, function (term) {
      if (!_.isObject(term)) {
        term = { name: term };
      }
      return _.defaults(term, defaults);
    }, this);
    return result;
  };
  return new Wrapper();
}

const tracer = function () {
  if (window.engine_trace) {
    console.log.call(console, arguments);
  }
};


function passThroughContext(context, extensionList) {
  function PTC() {

  }

  PTC.prototype = context;
  const result = new PTC();
  if (extensionList) {
    extensionList.unshift(result);
    _.assign.apply(_, extensionList);
    extensionList.shift();
  }
  return result;
}

function WalkingState(parent_name, components, contextExtensionList, depth, priority) {
  this.parent_name = parent_name;
  this.components = components;
  this.contextExtensionList = contextExtensionList;
  this.depth = depth || 0;
  this.priority = priority;
}


function walkTokenPath(tokenPath, walkingStates, context, editor) {
  if (!tokenPath || tokenPath.length === 0) {
    return walkingStates;
  }
  let token = tokenPath[0],
    nextWalkingStates = [];

  tracer('starting token evaluation [' + token + ']');

  _.each(walkingStates, function (ws) {
    const contextForState = passThroughContext(context, ws.contextExtensionList);
    _.each(ws.components, function (component) {
      tracer('evaluating [' + token + '] with [' + component.name + ']', component);
      const result = component.match(token, contextForState, editor);
      if (result && !_.isEmpty(result)) {
        tracer('matched [' + token + '] with:', result);
        let next, extensionList;
        if (result.next && !Array.isArray(result.next)) {
          next = [result.next];
        }
        else {
          next = result.next;
        }
        if (result.context_values) {
          extensionList = [];
          [].push.apply(extensionList, ws.contextExtensionList);
          extensionList.push(result.context_values);
        }
        else {
          extensionList = ws.contextExtensionList;
        }

        let priority = ws.priority;
        if (_.isNumber(result.priority)) {
          if (_.isNumber(priority)) {
            priority = Math.min(priority, result.priority);
          }
          else {
            priority = result.priority;
          }
        }

        nextWalkingStates.push(new WalkingState(component.name, next, extensionList, ws.depth + 1, priority));
      }
    });
  });

  if (nextWalkingStates.length == 0) {
    // no where to go, still return context variables returned so far..
    return _.map(walkingStates, function (ws) {
      return new WalkingState(ws.name, [], ws.contextExtensionList);
    });
  }

  return walkTokenPath(tokenPath.slice(1), nextWalkingStates, context, editor);
}

export function resolvePathToComponents(tokenPath, context, editor, components) {
  const walkStates = walkTokenPath(tokenPath, [new WalkingState('ROOT', components, [])], context, editor);
  const result = [].concat.apply([], _.pluck(walkStates, 'components'));
  return result;
}

export function populateContext(tokenPath, context, editor, includeAutoComplete, components) {

  let walkStates = walkTokenPath(tokenPath, [new WalkingState('ROOT', components, [])], context, editor);
  if (includeAutoComplete) {
    let autoCompleteSet = [];
    _.each(walkStates, function (ws) {
      const contextForState = passThroughContext(context, ws.contextExtensionList);
      _.each(ws.components, function (component) {
        _.each(component.getTerms(contextForState, editor), function (term) {
          if (!_.isObject(term)) {
            term = { name: term };
          }
          autoCompleteSet.push(term);
        });
      });
    });
    autoCompleteSet = _.uniq(autoCompleteSet, false);
    context.autoCompleteSet = autoCompleteSet;
  }

  // apply what values were set so far to context, selecting the deepest on which sets the context
  if (walkStates.length !== 0) {
    let wsToUse;
    walkStates = _.sortBy(walkStates, function (ws) {
      return _.isNumber(ws.priority) ? ws.priority : Number.MAX_VALUE;
    });
    wsToUse = _.find(walkStates, function (ws) {
      return _.isEmpty(ws.components);
    });

    if (!wsToUse && walkStates.length > 1 && !includeAutoComplete) {
      console.info('more then one context active for current path, but autocomplete isn\'t requested', walkStates);
    }

    if (!wsToUse) {
      wsToUse = walkStates[0];
    }

    _.each(wsToUse.contextExtensionList, function (extension) {
      _.assign(context, extension);
    });
  }
}
