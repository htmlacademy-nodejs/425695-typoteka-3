'use strict';

module.exports = {
  'env': {'es6': true, 'jest': true, 'node': true},
  'parserOptions': {
    'ecmaVersion': 2018,
  },
  'plugins': [
    'import',
  ],
  'extends': ['htmlacademy/node'],
  // 'root': true,
  'rules': {
    'import/order': ['error'],
    'quotes': ['error', 'single', {'allowTemplateLiterals': false, 'avoidEscape': true}],
  },
};
