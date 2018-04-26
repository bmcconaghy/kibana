import _ from 'lodash';
import { ScopeResolver } from './scope_resolver';
import { ConditionalProxy } from './conditional_proxy';
import { ObjectComponent } from './object_component';

import {
  ConstantComponent,
  SharedComponent,
  wrapComponentWithDefaults
} from '../engine';
/**
 * @param description a json dict describing the endpoint
 * @param compilingContext
 */
export function compileDescription(description, compilingContext) {
  if (Array.isArray(description)) {
    return [compileList(description, compilingContext)];
  }
  else if (_.isObject(description)) {
    // test for objects list as arrays are also objects
    if (description.__scope_link) {
      return [new ScopeResolver(description.__scope_link, compilingContext)];
    }
    if (description.__any_of) {
      return [compileList(description.__any_of, compilingContext)];
    }
    if (description.__one_of) {
      return _.flatten(_.map(description.__one_of, function (d) {
        return compileDescription(d, compilingContext);
      }));
    }
    const obj = compileObject(description, compilingContext);
    if (description.__condition) {
      return [compileCondition(description.__condition, obj, compilingContext)];
    } else {
      return [obj];
    }
  }
  else if (_.isString(description) && /^\{.*\}$/.test(description)) {
    return [compileParametrizedValue(description, compilingContext)];
  }
  else {
    return [new ConstantComponent(description)];
  }

}
function compileList(listRule, compilingContext) {
  const listC = new ConstantComponent('[');
  _.each(listRule, function (desc) {
    _.each(compileDescription(desc, compilingContext), function (component) {
      listC.addComponent(component);
    });
  });
  return listC;
}

/** takes a compiled object and wraps in a {@link ConditionalProxy }*/
function compileCondition(description, compiledObject) {
  if (description.lines_regex) {
    return new ConditionalProxy(function (context, editor) {
      const lines = editor.getSession().getLines(context.requestStartRow, editor.getCursorPosition().row).join('\n');
      return new RegExp(description.lines_regex, 'm').test(lines);
    }, compiledObject);
  } else {
    throw 'unknown condition type - got: ' + JSON.stringify(description);
  }
}

function compileObject(objDescription, compilingContext) {
  const objectC = new ConstantComponent('{');
  const constants = [];
  const patterns = [];
  _.each(objDescription, function (desc, key) {
    if (key.indexOf('__') == 0) {
      // meta key
      return;
    }

    const options = getOptions(desc);
    let component;
    if (/^\{.*\}$/.test(key)) {
      component = compileParametrizedValue(key, compilingContext, options.template);
      patterns.push(component);
    }
    else if (key === '*') {
      component = new SharedComponent(key);
      patterns.push(component);
    }
    else {
      options.name = key;
      component = new ConstantComponent(key, null, [options]);
      constants.push(component);
    }
    _.map(compileDescription(desc, compilingContext), function (subComponent) {
      try {
        component.addComponent(subComponent);
      } catch (error) {
        console.log('ERROR', error);
        console.log('COMPONENT', component);
      }

    });
  });
  objectC.addComponent(new ObjectComponent('inner', constants, patterns));
  return objectC;
}


function compileParametrizedValue(value, compilingContext, template) {
  value = value.substr(1, value.length - 2).toLowerCase();
  let component = compilingContext.parametrizedComponentFactories[value];
  if (!component) {
    throw new Error('no factory found for \'' + value + '\'');
  }
  component = component(value, null, template);
  if (!_.isUndefined(template)) {
    component = wrapComponentWithDefaults(component, { template: template });
  }
  return component;

}

function getTemplate(description) {
  if (description.__template) {
    return description.__template;
  }
  else if (description.__one_of) {
    return getTemplate(description.__one_of[0]);
  }
  else if (description.__any_of) {
    return [];
  }
  else if (description.__scope_link) {
    // assume an object for now.
    return {};
  }
  else if (Array.isArray(description)) {
    if (description.length == 1) {
      if (_.isObject(description[0])) {
        // shortcut to save typing
        const innerTemplate = getTemplate(description[0]);

        return innerTemplate != null ? [innerTemplate] : [];
      }
    }
    return [];
  }
  else if (_.isObject(description)) {
    return {};
  }
  else if (_.isString(description) && !/^\{.*\}$/.test(description)) {
    return description;
  }
  else {
    return description;
  }
}

function getOptions(description) {
  const options = {};
  const template = getTemplate(description);

  if (!_.isUndefined(template)) {
    options.template = template;
  }
  return options;
}
