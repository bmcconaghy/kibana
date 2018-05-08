const ace = require('ace');
const x_json = require('./x_json_highlight_rules');
import * as constants from '../../constants';

const oop = ace.acequire('ace/lib/oop');
const { TextHighlightRules } = ace.acequire('ace/mode/text_highlight_rules');
export function InputHighlightRules() {
  function mergeTokens(/* ... */) {
    return [].concat.apply([], arguments);
  }

  function addEOL(tokens, reg, nextIfEOL, normalNext) {
    if (typeof reg === 'object') {
      reg = reg.source;
    }
    return [
      { token: tokens.concat([constants.WHITESPACE]), regex: reg + '(\\s*)$', next: nextIfEOL },
      { token: tokens, regex: reg, next: normalNext }
    ];
  }

  // regexp must not have capturing parentheses. Use (?:) instead.
  // regexps are ordered -> the first match is used
  /*jshint -W015 */
  this.$rules = {
    'start': mergeTokens([
      { 'token': 'warning', 'regex': '#!.*$' },
      { token: 'comment', regex: /^#.*$/ },
      { token: constants.PAREN_LEFT, regex: '{', next: 'json', push: true }
    ],
    addEOL([constants.METHOD], /([a-zA-Z]+)/, 'start', 'method_sep')
      ,
    [
      {
        token: constants.WHITESPACE,
        regex: '\\s+'
      },
      {
        token: constants.TEXT,
        regex: '.+?'
      }
    ]),
    'method_sep': mergeTokens(
      addEOL([constants.WHITESPACE, 'url.protocol_host', constants.URL_SLASH], /(\s+)(https?:\/\/[^?\/,]+)(\/)/, 'start', 'url'),
      addEOL([constants.WHITESPACE, 'url.protocol_host'], /(\s+)(https?:\/\/[^?\/,]+)/, 'start', 'url'),
      addEOL([constants.WHITESPACE, constants.URL_SLASH], /(\s+)(\/)/, 'start', 'url'),
      addEOL([constants.WHITESPACE], /(\s+)/, 'start', 'url')
    ),
    'url': mergeTokens(
      addEOL([constants.URL_PART], /([^?\/,\s]+)/, 'start'),
      addEOL([constants.URL_COMMA], /(,)/, 'start'),
      addEOL([constants.URL_SLASH], /(\/)/, 'start'),
      addEOL([constants.URL_QUESTIONMARK], /(\?)/, 'start', 'urlParams')
    ),
    'urlParams': mergeTokens(
      addEOL(['url.param', constants.URL_EQUAL, constants.URL_VALUE], /([^&=]+)(=)([^&]*)/, 'start'),
      addEOL(['url.param'], /([^&=]+)/, 'start'),
      addEOL([constants.URL_AMP], /(&)/, 'start')
    )
  };

  x_json.addToRules(this);

  if (this.constructor === InputHighlightRules) {
    this.normalizeRules();
  }

}

oop.inherits(InputHighlightRules, TextHighlightRules);
