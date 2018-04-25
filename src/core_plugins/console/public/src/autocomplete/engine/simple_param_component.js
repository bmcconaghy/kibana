import { SharedComponent } from './shared_component';

export class SimpleParamComponent extends SharedComponent {
  match(token, context, editor) {
    const result = super.match(token, context, editor);
    result.context_values = result.context_values || {};
    result.context_values[this.name] = token;
    return result;
  }
}