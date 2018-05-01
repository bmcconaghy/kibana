const _ = require('lodash');
import {
  VARIABLE,
  WHITESPACE,
  PUNCTUATION_COLON,
  PUNCTUATION_COMMA,
  PUNCTUATION_START_TRIPLE_QUOTE,
  STRING,
  NUMERIC,
  PAREN_LEFT,
  PAREN_RIGHT,
  LANGUAGE_BOOLEAN,
  PUNCTUATION_END_TRIPLE_QUOTE,
  TEXT
} from '../../constants';
const ScriptHighlightRules = require('./script_highlight_rules').ScriptHighlightRules;

const jsonRules = function (root) {
  root = root ? root : 'json';
  const rules = {};
  rules[root] = [
    {
      token: [VARIABLE, WHITESPACE, 'ace.punctuation.colon', WHITESPACE, PUNCTUATION_START_TRIPLE_QUOTE],
      regex: '("(?:[^"]*_)?script"|"inline"|"source")(\\s*?)(:)(\\s*?)(""")',
      next: 'script-start',
      merge: false,
      push: true
    },
    {
      token: VARIABLE, // single line
      regex: '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]\\s*(?=:)'
    },
    {
      token: PUNCTUATION_START_TRIPLE_QUOTE,
      regex: '"""',
      next: 'string_literal',
      merge: false,
      push: true
    },
    {
      token: STRING, // single line
      regex: '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
    },
    {
      token: NUMERIC, // hex
      regex: '0[xX][0-9a-fA-F]+\\b'
    },
    {
      token: NUMERIC, // float
      regex: '[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b'
    },
    {
      token: LANGUAGE_BOOLEAN,
      regex: '(?:true|false)\\b'
    },
    {
      token: 'invalid.illegal', // single quoted strings are not allowed
      regex: '[\'](?:(?:\\\\.)|(?:[^\'\\\\]))*?[\']'
    },
    {
      token: 'invalid.illegal', // comments are not allowed
      regex: '\\/\\/.*$'
    },
    {
      token: PAREN_LEFT,
      merge: false,
      regex: '{',
      next: root,
      push: true
    },
    {
      token: PAREN_LEFT,
      merge: false,
      regex: '[[(]'
    },
    {
      token: PAREN_RIGHT,
      merge: false,
      regex: '[\\])]'
    },
    {
      token: 'paren.rparen',
      regex: '}',
      merge: false,
      next: 'pop'
    },
    {
      token: PUNCTUATION_COMMA,
      regex: ','
    },
    {
      token: PUNCTUATION_COLON,
      regex: ':'
    },
    {
      token: WHITESPACE,
      regex: '\\s+'
    },
    {
      token: TEXT,
      regex: '.+?'
    }
  ];
  rules.string_literal = [
    {
      token: PUNCTUATION_END_TRIPLE_QUOTE,
      regex: '"""',
      next: 'pop'
    },
    {
      token: 'multi_string',
      regex: '.'
    }
  ];
  return rules;
};

export function addToRules(otherRules, embedUnder) {
  otherRules.$rules = _.defaultsDeep(otherRules.$rules, jsonRules(embedUnder));
  otherRules.embedRules(ScriptHighlightRules, 'script-', [{
    token: PUNCTUATION_END_TRIPLE_QUOTE,
    regex: '"""',
    next: 'pop',
  }]);
}
