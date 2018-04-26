import { SharedComponent } from '../engine';
export class ConditionalProxy extends SharedComponent {
  constructor(predicate, delegate) {
    super('__condition', null);
    this.predicate = predicate;
    this.delegate = delegate;
  }

  getTerms(context, editor) {
    if (this.predicate(context, editor)) {
      return this.delegate.getTerms(context, editor);
    } else {
      return null;
    }
  }

  match(token, context, editor) {
    if (this.predicate(context, editor)) {
      return this.delegate.match(token, context, editor);
    } else {
      return false;
    }
  }
}