import _ from 'lodash';
import { ConstantComponent, SharedComponent, ListComponent } from './engine';

export class ParamComponent extends ConstantComponent {
  constructor(name, parent, description) {
    super(name, parent);
    this.description = description;
  }
  getTerms() {
    const t = { name: this.name };
    if (this.description === '__flag__') {
      t.meta = 'flag';
    }
    else {
      t.meta = 'param';
      t.insert_value = this.name + '=';
    }
    return [t];
  }
}

export class UrlParams {
  constructor(description, defaults) {
    // This is not really a component, just a handy container to make iteration logic simpler
    this.rootComponent = new SharedComponent('ROOT');
    if (_.isUndefined(defaults)) {
      defaults = {
        'pretty': '__flag__',
        'format': ['json', 'yaml'],
        'filter_path': '',
      };
    }
    description = _.clone(description || {});
    _.defaults(description, defaults);
    _.each(description, function (paramDescription, param) {
      const component = new ParamComponent(param, this.rootComponent, paramDescription);
      if (Array.isArray(paramDescription)) {
        new ListComponent(param, paramDescription, component);
      }
      else if (paramDescription === '__flag__') {
        new ListComponent(param, ['true', 'false'], component);
      }
    }, this);

  }
  getTopLevelComponents() {
    return this.rootComponent.next;
  }
}

