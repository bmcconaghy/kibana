import { GlobalOnlyComponent } from './global_only_component';
import { compileDescription } from './compile';

class CompilingContext {
  constructor(endpointId, parametrizedComponentFactories)  {
    this.parametrizedComponentFactories = parametrizedComponentFactories;
    this.endpointId = endpointId;
  }
}

// a list of component that match anything but give auto complete suggestions based on global API entries.
export function globalsOnlyAutocompleteComponents() {
  return [new GlobalOnlyComponent('__global__')];
}

/**
 * @param endpoint_id id of the endpoint being compiled.
 * @param description a json dict describing the endpoint
 * @param endpointComponentResolver a function (endpoint,context,editor) which should resolve an endpoint
 *        to it's list of compiled components.
 * @param parametrizedComponentFactories a dict of the following structure
 * that will be used as a fall back for pattern keys (i.e.: {type} ,resolved without the $s)
 * {
   *   TYPE: function (part, parent, endpoint) {
   *      return new SharedComponent(part, parent)
   *   }
   * }
 */
export function compileBodyDescription(endpoint_id, description, parametrizedComponentFactories) {
  return compileDescription(description, new CompilingContext(endpoint_id, parametrizedComponentFactories));
}