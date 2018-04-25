import { AutocompleteComponent } from './autocomplete_component';
import _ from 'lodash';

export class SharedComponent extends AutocompleteComponent {
  constructor(name, parent) {
    super(name);
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