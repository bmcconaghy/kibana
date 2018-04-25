import _ from 'lodash';
import { UrlPatternMatcher } from '../autocomplete/url_pattern_matcher';
import { UrlParams } from '../autocomplete/url_params';
import { compileBodyDescription, globalsOnlyAutocompleteComponents } from '../autocomplete/body_completer';

/**
 *
 * @param urlParametrizedComponentFactories a dictionary of factory functions
 * that will be used as fallback for parametrized path part (i.e., {indices} )
 * see url_pattern_matcher.UrlPatternMatcher
 * @constructor
 * @param bodyParametrizedComponentFactories same as urlParametrizedComponentFactories but used for body compilation
 */
class Api {
  constructor(urlParametrizedComponentFactories, bodyParametrizedComponentFactories) {
    this.globalRules = {};
    this.endpoints = {};
    this.urlPatternMatcher = new UrlPatternMatcher(urlParametrizedComponentFactories);
    this.globalBodyComponentFactories = bodyParametrizedComponentFactories;
    this.name = '';
  }
  addGlobalAutocompleteRules(parentNode, rules) {
    this.globalRules[parentNode] = compileBodyDescription(
      'GLOBAL.' + parentNode, rules, this.globalBodyComponentFactories);
  }

  getGlobalAutocompleteComponents(term, throwOnMissing) {
    const result = this.globalRules[term];
    if (_.isUndefined(result) && (throwOnMissing || _.isUndefined(throwOnMissing))) {
      throw new Error('failed to resolve global components for  [\'' + term + '\']');
    }
    return result;
  }

  addEndpointDescription(endpoint, description) {

    const copiedDescription = {};
    _.extend(copiedDescription, description || {});
    _.defaults(copiedDescription, {
      id: endpoint,
      patterns: [endpoint],
      methods: ['GET']
    });
    _.each(copiedDescription.patterns, function (p) {
      this.urlPatternMatcher.addEndpoint(p, copiedDescription);
    }, this);

    copiedDescription.paramsAutocomplete = new UrlParams(copiedDescription.url_params);
    copiedDescription.bodyAutocompleteRootComponents = compileBodyDescription(
      copiedDescription.id, copiedDescription.data_autocomplete_rules, this.globalBodyComponentFactories);

    this.endpoints[endpoint] = copiedDescription;
  }
  getEndpointDescriptionByEndpoint(endpoint) {
    return this.endpoints[endpoint];
  }
  getTopLevelUrlCompleteComponents() {
    return this.urlPatternMatcher.getTopLevelComponents();
  }
  getUnmatchedEndpointComponents() {
    return globalsOnlyAutocompleteComponents();
  }
  clear() {
    this.endpoints = {};
    this.globalRules = {};
  }
}

export default Api;
