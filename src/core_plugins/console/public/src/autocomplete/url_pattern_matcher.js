import _ from 'lodash';
import {
  SharedComponent,
  ConstantComponent,
  ListComponent,
  SimpleParamComponent,
} from './engine';

export const URL_PATH_END_MARKER = '__url_path_end__';

class AcceptEndpointComponent extends SharedComponent {
  constructor(endpoint, parent) {
    super(endpoint.id, parent);
    this.endpoint = endpoint;
  }
  match(token, context, editor) {
    if (token !== URL_PATH_END_MARKER) {
      return null;
    }
    if (
      this.endpoint.methods &&
      -1 === _.indexOf(this.endpoint.methods, context.method)
    ) {
      return null;
    }
    const r = super.match(token, context, editor);
    r.context_values = r.context_values || {};
    r.context_values.endpoint = this.endpoint;
    if (_.isNumber(this.endpoint.priority)) {
      r.priority = this.endpoint.priority;
    }
    return r;
  }
}

/**
 * @param parametrizedComponentFactories a dict of the following structure
 * that will be used as a fall back for pattern parameters (i.e.: {indices})
 * {
 *   indices: function (part, parent) {
 *      return new SharedComponent(part, parent)
 *   }
 * }
 * @constructor
 */
export class UrlPatternMatcher {
  constructor(parametrizedComponentFactories) {
    this.rootComponent = new SharedComponent('ROOT');
    this.parametrizedComponentFactories = parametrizedComponentFactories || {};
  }
  addEndpoint(pattern, endpoint) {
    let c;
    let activeComponent = this.rootComponent;
    const endpointComponents = endpoint.url_components || {};
    const partList = pattern.split('/');
    _.each(
      partList,
      function (part, partIndex) {
        if (part.search(/^{.+}$/) >= 0) {
          part = part.substr(1, part.length - 2);
          if (activeComponent.getComponent(part)) {
            // we already have something for this, reuse
            activeComponent = activeComponent.getComponent(part);
            return;
          }
          // a new path, resolve.

          if ((c = endpointComponents[part])) {
            // endpoint specific. Support list
            if (Array.isArray(c)) {
              c = new ListComponent(part, c, activeComponent);
            } else if (_.isObject(c) && c.type === 'list') {
              c = new ListComponent(
                part,
                c.list,
                activeComponent,
                c.multi_valued,
                c.allow_non_valid
              );
            } else {
              console.warn(
                'incorrectly configured url component ',
                part,
                ' in endpoint',
                endpoint
              );
              c = new SharedComponent(part);
            }
          } else if ((c = this.parametrizedComponentFactories[part])) {
            // c is a f
            c = c(part, activeComponent);
          } else {
            // just accept whatever with not suggestions
            c = new SimpleParamComponent(part, activeComponent);
          }

          activeComponent = c;
        } else {
          // not pattern
          let lookAhead = part;
          let s;

          for (partIndex++; partIndex < partList.length; partIndex++) {
            s = partList[partIndex];
            if (s.indexOf('{') >= 0) {
              break;
            }
            lookAhead += '/' + s;
          }

          if (activeComponent.getComponent(part)) {
            // we already have something for this, reuse
            activeComponent = activeComponent.getComponent(part);
            activeComponent.addOption(lookAhead);
          } else {
            c = new ConstantComponent(part, activeComponent, lookAhead);
            activeComponent = c;
          }
        }
      },
      this
    );
    // mark end of endpoint path
    new AcceptEndpointComponent(endpoint, activeComponent);
  }

  getTopLevelComponents() {
    return this.rootComponent.next;
  }
}
