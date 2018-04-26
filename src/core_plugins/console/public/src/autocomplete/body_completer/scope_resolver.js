import { SharedComponent, resolvePathToComponents } from '../engine';
import _ from 'lodash';
import { compileDescription } from './compile';

/**
 * An object to resolve scope links (syntax endpoint.path1.path2)
 * @param link the link either string (endpoint.path1.path2, or .path1.path2) or a function (context,editor)
 * which returns a description to be compiled
 * @constructor
 * @param compilingContext
 *
 *
 * For this to work we expect the context to include a method context.endpointComponentResolver(endpoint)
 * which should return the top level components for the given endpoint
 */
export class ScopeResolver extends SharedComponent {
  constructor(link, compilingContext) {
    super('__scope_link', null);
    if (_.isString(link) && link[0] === '.') {
      // relative link, inject current endpoint
      if (link === '.') {
        link = compilingContext.endpointId;
      }
      else {
        link = compilingContext.endpointId + link;
      }
    }
    this.link = link;
    this.compilingContext = compilingContext;
  }

  resolveLinkToComponents(context, editor) {
    if (_.isFunction(this.link)) {
      const desc = this.link(context, editor);
      return compileDescription(desc, this.compilingContext);
    }
    if (!_.isString(this.link)) {
      throw new Error('unsupported link format', this.link);
    }

    let path = this.link.replace(/\./g, '{').split(/(\{)/);
    const endpoint = path[0];
    let components;
    try {
      if (endpoint === 'GLOBAL') {
        // global rules need an extra indirection
        if (path.length < 3) {
          throw new Error('missing term in global link: ' + this.link);
        }
        const term = path[2];
        components = context.globalComponentResolver(term);
        path = path.slice(3);
      }
      else {
        path = path.slice(1);
        components = context.endpointComponentResolver(endpoint);
      }
    }
    catch (e) {
      throw new Error('failed to resolve link [' + this.link + ']: ' + e);
    }
    return resolvePathToComponents(path, context, editor, components);
  }

  getTerms(context, editor) {
    const options = [];
    const components = this.resolveLinkToComponents(context, editor);
    _.each(components, function (component) {
      options.push.apply(options, component.getTerms(context, editor));
    });
    return options;
  }

  match(token, context, editor) {
    const result = {
      next: []
    };
    const  components = this.resolveLinkToComponents(context, editor);
    _.each(components, function (component) {
      const componentResult = component.match(token, context, editor);
      if (componentResult && componentResult.next) {
        result.next.push.apply(result.next, componentResult.next);
      }
    });
    return result;
  }
}
