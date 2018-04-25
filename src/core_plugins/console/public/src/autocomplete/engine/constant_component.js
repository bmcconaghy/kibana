import { SharedComponent } from './shared_component';
import _ from 'lodash';

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

    return super.match(token, context, editor);

  }
}