import { AutocompleteComponent } from '../engine';
export class GlobalOnlyComponent extends AutocompleteComponent {
  getTerms() {
    return null;
  }
  match(token, context) {
    const result = {
      next: []
    };
    // try to link to GLOBAL rules
    const globalRules = context.globalComponentResolver(token, false);
    if (globalRules) {
      result.next.push.apply(result.next, globalRules);
    }
    if (result.next.length) {
      return result;
    }
    // just loop back to us
    result.next = [this];
    return result;
  }
}