const ace = require('ace');
const $ = require('jquery');
import { initializeInput } from '../../src/input';
let input;
import * as constants from '../../src/constants';

const token_iterator = ace.acequire('ace/token_iterator');
const { module, asyncTest, deepEqual, start } = window.QUnit;


module('Input Tokenization', {
  setup: function () {
    input = initializeInput($('#editor'), $('#editor_actions'), $('#copy_as_curl'), null);
    input.$el.show();
    input.autocomplete._test.removeChangeListener();
  },
  teardown: function () {
    input.$el.hide();
    input.autocomplete._test.addChangeListener();
  }
});

function tokensAsList() {
  const iter = new token_iterator.TokenIterator(input.getSession(), 0, 0);
  const ret = [];
  let t = iter.getCurrentToken();
  if (input.parser.isEmptyToken(t)) {
    t = input.parser.nextNonEmptyToken(iter);
  }
  while (t) {
    ret.push({ value: t.value, type: t.type });
    t = input.parser.nextNonEmptyToken(iter);
  }

  return ret;
}

let testCount = 0;

function token_test(token_list, prefix, data) {
  if (data && typeof data !== 'string') {
    data = JSON.stringify(data, null, 3);
  }
  if (data) {
    if (prefix) {
      data = prefix + '\n' + data;
    }
  }
  else {
    data = prefix;
  }

  asyncTest('Token test ' + testCount++ + ' prefix: ' + prefix, function () {
    input.update(data, function () {
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
  ['method', 'GET', constants.URL_PART, '_search'],
  'GET _search'
);

token_test(
  ['method', 'GET', constants.URL_SLASH, '/', constants.URL_PART, '_search'],
  'GET /_search'
);

token_test(
  ['method', 'GET', 'url.protocol_host', 'http://somehost', constants.URL_SLASH, '/', constants.URL_PART, '_search'],
  'GET http://somehost/_search'
);

token_test(
  ['method', 'GET', 'url.protocol_host', 'http://somehost'],
  'GET http://somehost'
);

token_test(
  ['method', 'GET', 'url.protocol_host', 'http://somehost', constants.URL_SLASH, '/'],
  'GET http://somehost/'
);

token_test(
  ['method', 'GET', 'url.protocol_host', 'http://test:user@somehost', constants.URL_SLASH, '/'],
  'GET http://test:user@somehost/'
);

token_test(
  ['method', 'GET', constants.URL_PART, '_cluster', constants.URL_SLASH, '/', constants.URL_PART, 'nodes'],
  'GET _cluster/nodes'
);

token_test(
  ['method', 'GET', constants.URL_SLASH, '/', constants.URL_PART, '_cluster', constants.URL_SLASH, '/', constants.URL_PART, 'nodes'],
  'GET /_cluster/nodes'
);


token_test(
  ['method', 'GET', constants.URL_PART, 'index', constants.URL_SLASH, '/', constants.URL_PART, '_search'],
  'GET index/_search'
);

token_test(
  ['method', 'GET', constants.URL_PART, 'index'],
  'GET index'
);

token_test(
  ['method', 'GET', constants.URL_PART, 'index', constants.URL_SLASH, '/', constants.URL_PART, 'type'],
  'GET index/type'
);

token_test(
  ['method', 'GET', constants.URL_SLASH, '/', constants.URL_PART, 'index', constants.URL_SLASH, '/', constants.URL_PART, 'type', constants.URL_SLASH, '/'],
  'GET /index/type/'
);

token_test(
  ['method', 'GET', constants.URL_PART, 'index', constants.URL_SLASH, '/', constants.URL_PART, 'type', constants.URL_SLASH, '/', constants.URL_PART, '_search'],
  'GET index/type/_search'
);

token_test(
  ['method', 'GET', constants.URL_PART, 'index', constants.URL_SLASH, '/', constants.URL_PART, 'type', constants.URL_SLASH, '/', constants.URL_PART, '_search',
    constants.URL_QUESTIONMARK, '?', 'url.param', 'value', constants.URL_EQUAL, '=', constants.URL_VALUE, '1'
  ],
  'GET index/type/_search?value=1'
);


token_test(
  ['method', 'GET', constants.URL_PART, 'index', constants.URL_SLASH, '/', constants.URL_PART, 'type', constants.URL_SLASH, '/', constants.URL_PART, '1'],
  'GET index/type/1'
);


token_test(
  ['method', 'GET', constants.URL_SLASH, '/', constants.URL_PART, 'index1', constants.URL_COMMA, ',', constants.URL_PART, 'index2', constants.URL_SLASH, '/'],
  'GET /index1,index2/'
);

token_test(
  ['method', 'GET', constants.URL_SLASH, '/', constants.URL_PART, 'index1', constants.URL_COMMA, ',', constants.URL_PART, 'index2', constants.URL_SLASH, '/',
    constants.URL_PART, '_search'],
  'GET /index1,index2/_search'
);

token_test(
  ['method', 'GET', constants.URL_PART, 'index1', constants.URL_COMMA, ',', constants.URL_PART, 'index2', constants.URL_SLASH, '/',
    constants.URL_PART, '_search'],
  'GET index1,index2/_search'
);

token_test(
  ['method', 'GET', constants.URL_SLASH, '/', constants.URL_PART, 'index1', constants.URL_COMMA, ',', constants.URL_PART, 'index2'],
  'GET /index1,index2'
);

token_test(
  ['method', 'GET', constants.URL_PART, 'index1', constants.URL_COMMA, ',', constants.URL_PART, 'index2'],
  'GET index1,index2'
);

token_test(
  ['method', 'GET', constants.URL_SLASH, '/', constants.URL_PART, 'index1', constants.URL_COMMA, ','],
  'GET /index1,'
);


token_test(
  ['method', 'PUT', constants.URL_SLASH, '/', constants.URL_PART, 'index', constants.URL_SLASH, '/'],
  'PUT /index/'
);

token_test(
  ['method', 'GET', constants.URL_PART, 'index', constants.URL_SLASH, '/', constants.URL_PART, '_search'],
  'GET index/_search '
);

token_test(
  ['method', 'PUT', constants.URL_SLASH, '/', constants.URL_PART, 'index'],
  'PUT /index'
);

token_test(
  ['method', 'PUT', constants.URL_SLASH, '/', constants.URL_PART, 'index1', constants.URL_COMMA, ',', constants.URL_PART, 'index2',
    constants.URL_SLASH, '/', constants.URL_PART, 'type1', constants.URL_COMMA, ',', constants.URL_PART, 'type2'],
  'PUT /index1,index2/type1,type2'
);

token_test(
  ['method', 'PUT', constants.URL_SLASH, '/', constants.URL_PART, 'index1',
    constants.URL_SLASH, '/', constants.URL_PART, 'type1', constants.URL_COMMA, ',', constants.URL_PART, 'type2', constants.URL_COMMA, ','],
  'PUT /index1/type1,type2,'
);

token_test(
  ['method', 'PUT', constants.URL_PART, 'index1', constants.URL_COMMA, ',', constants.URL_PART, 'index2',
    constants.URL_SLASH, '/', constants.URL_PART, 'type1', constants.URL_COMMA, ',', constants.URL_PART, 'type2', constants.URL_SLASH, '/',
    constants.URL_PART, '1234'],
  'PUT index1,index2/type1,type2/1234'
);


token_test(
  ['method', 'POST', constants.URL_PART, '_search', constants.PAREN_LEFT, '{', constants.VARIABLE, '"q"', constants.PUNCTUATION_COLON, ':',
    constants.PAREN_LEFT, '{', 'paren.rparen', '}', 'paren.rparen', '}'
  ],
  'POST _search\n' +
  '{\n' +
  '  "q": {}\n' +
  '  \n' +
  '}'
);

token_test(
  ['method', 'POST', constants.URL_PART, '_search', constants.PAREN_LEFT, '{', constants.VARIABLE, '"q"', constants.PUNCTUATION_COLON, ':',
    constants.PAREN_LEFT, '{', constants.VARIABLE, '"s"', constants.PUNCTUATION_COLON, ':', constants.PAREN_LEFT, '{', 'paren.rparen', '}',
    'paren.rparen', '}', 'paren.rparen', '}'
  ],
  'POST _search\n' +
  '{\n' +
  '  "q": { "s": {}}\n' +
  '  \n' +
  '}'
);

function statesAsList() {
  const ret = [];
  const session = input.getSession();
  const maxLine = session.getLength();
  for (let row = 0; row < maxLine; row++) ret.push(session.getState(row));

  return ret;
}


function states_test(states_list, prefix, data) {
  if (data && typeof data !== 'string') {
    data = JSON.stringify(data, null, 3);
  }
  if (data) {
    if (prefix) {
      data = prefix + '\n' + data;
    }
  }
  else {
    data = prefix;
  }

  asyncTest('States test ' + testCount++ + ' prefix: ' + prefix, function () {
    input.update(data, function () {
      const modes = statesAsList();
      deepEqual(modes, states_list, 'Doc:\n' + data);
      start();
    });
  });
}


states_test(
  ['start', 'json', 'json', 'start'],
  'POST _search\n' +
  '{\n' +
  '  "query": { "match_all": {} }\n' +
  '}'
);

states_test(
  ['start', 'json', ['json', 'json'], ['json', 'json'], 'json', 'start'],
  'POST _search\n' +
  '{\n' +
  '  "query": { \n' +
  '  "match_all": {} \n' +
  '  }\n' +
  '}'
);

states_test(
  ['start', 'json', 'json', 'start'],
  'POST _search\n' +
  '{\n' +
  '  "script": { "inline": "" }\n' +
  '}'
);

states_test(
  ['start', 'json', 'json', 'start'],
  'POST _search\n' +
  '{\n' +
  '  "script": ""\n' +
  '}'
);

states_test(
  ['start', 'json', ['json', 'json'], 'json', 'start'],
  'POST _search\n' +
  '{\n' +
  '  "script": {\n' +
  '   }\n' +
  '}'
);


states_test(
  ['start', 'json', ['script-start', 'json', 'json', 'json'], ['script-start', 'json', 'json', 'json'],
    ['json', 'json'], 'json', 'start'],
  'POST _search\n' +
  '{\n' +
  '  "test": { "script": """\n' +
  '  test script\n' +
  ' """\n' +
  ' }\n' +
  '}'
);

states_test(
  ['start', 'json', ['script-start', 'json'], ['script-start', 'json'], 'json', 'start'],
  'POST _search\n' +
  '{\n' +
  '  "script": """\n' +
  '  test script\n' +
  ' """,\n' +
  '}'
);

states_test(
  ['start', 'json', 'json', 'start'],
  'POST _search\n' +
  '{\n' +
  '  "script": """test script""",\n' +
  '}'
);


states_test(
  ['start', 'json', ['string_literal', 'json'], ['string_literal', 'json'], 'json', 'start'],
  'POST _search\n' +
  '{\n' +
  '  "somthing": """\n' +
  '  test script\n' +
  ' """,\n' +
  '}'
);

states_test(
  ['start', 'json', ['string_literal', 'json', 'json', 'json'], ['string_literal', 'json', 'json', 'json'],
    ['json', 'json'], ['json', 'json'],
    'json', 'start'],
  'POST _search\n' +
  '{\n' +
  '  "somthing": { "f" : """\n' +
  '  test script\n' +
  ' """,\n' +
  ' "g": 1\n' +
  ' }\n' +
  '}'
);

states_test(
  ['start', 'json', 'json', 'start'],
  'POST _search\n' +
  '{\n' +
  '  "something": """test script""",\n' +
  '}'
);
