import { AutocompleteComponent } from '../engine';
import _ from 'lodash';

/**
 * @param constants list of components that represent constant keys
 * @param patternsAndWildCards list of components that represent patterns and should be matched only if
 * there is no constant matches
 */
export class ObjectComponent extends AutocompleteComponent {
  constructor(name, constants, patternsAndWildCards) {
    super(name);
    this.constants = constants;
    this.patternsAndWildCards = patternsAndWildCards;
  }
  getTerms(context, editor) {
    const options = [];
    _.each(this.constants, function (component) {
      options.push.apply(options, component.getTerms(context, editor));
    });
    _.each(this.patternsAndWildCards, function (component) {
      options.push.apply(options, component.getTerms(context, editor));
    });
    return options;
  }

  match(token, context, editor) {
    const result = {
      next: []
    };
    _.each(this.constants, function (component) {
      const componentResult = component.match(token, context, editor);
      if (componentResult && componentResult.next) {
        result.next.push.apply(result.next, componentResult.next);
      }
    });

    // try to link to GLOBAL rules
    const globalRules = context.globalComponentResolver(token, false);
    if (globalRules) {
      result.next.push.apply(result.next, globalRules);
    }

    if (result.next.length) {
      return result;
    }
    _.each(this.patternsAndWildCards, function (component) {
      const componentResult = component.match(token, context, editor);
      if (componentResult && componentResult.next) {
        result.next.push.apply(result.next, componentResult.next);
      }
    });
    return result;
  }
}