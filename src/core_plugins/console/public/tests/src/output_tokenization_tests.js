const ace = require('ace');
const $ = require('jquery');
const RowParser = require('../../src/sense_editor/row_parser');
import { initializeOutput } from '../../src/output';
import {
  PAREN_LEFT,
  VARIABLE,
  PUNCTUATION_COLON,
  PUNCTUATION_START_TRIPLE_QUOTE,
  PUNCTUATION_END_TRIPLE_QUOTE,
} from '../../src/constants';
let output;

const token_iterator = ace.acequire('ace/token_iterator');
const { module, asyncTest, deepEqual, start } = window.QUnit;

module('Output Tokenization', {
  setup: function () {
    output = initializeOutput($('#output'));
    output.$el.show();
  },
  teardown: function () {
    output.$el.hide();
  },
});

function tokensAsList() {
  const iter = new token_iterator.TokenIterator(output.getSession(), 0, 0);
  const ret = [];
  let t = iter.getCurrentToken();
  const parser = new RowParser(output);
  if (parser.isEmptyToken(t)) {
    t = parser.nextNonEmptyToken(iter);
  }
  while (t) {
    ret.push({ value: t.value, type: t.type });
    t = parser.nextNonEmptyToken(iter);
  }

  return ret;
}

let testCount = 0;

function token_test(token_list, data) {
  if (data && typeof data !== 'string') {
    data = JSON.stringify(data, null, 3);
  }

  asyncTest('Token test ' + testCount++, function () {
    output.update(data, function () {
      const tokens = tokensAsList();
      const normTokenList = [];
      for (let i = 0; i < token_list.length; i++) {
        normTokenList.push({ type: token_list[i++], value: token_list[i] });
      }

      deepEqual(tokens, normTokenList, 'Doc:\n' + data);
      start();
    });
  });
}

token_test(
  [
    'warning',
    '#! warning',
    'comment',
    '# GET url',
    PAREN_LEFT,
    '{',
    'paren.rparen',
    '}',
  ],
  '#! warning\n' + '# GET url\n' + '{}'
);

token_test(
  [
    'comment',
    '# GET url',
    PAREN_LEFT,
    '{',
    VARIABLE,
    '"f"',
    PUNCTUATION_COLON,
    ':',
    PUNCTUATION_START_TRIPLE_QUOTE,
    '"""',
    'multi_string',
    'raw',
    PUNCTUATION_END_TRIPLE_QUOTE,
    '"""',
    'paren.rparen',
    '}',
  ],
  '# GET url\n' + '{ "f": """raw""" }'
);
