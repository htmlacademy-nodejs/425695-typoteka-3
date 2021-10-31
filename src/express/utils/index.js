'use strict';

const prepareErrors = (errors) => {
  return errors.response.data.split(`\n`);
};
const ensureArray = (value) => Array.isArray(value) ? value : [value];

module.exports = {
  ensureArray,
  prepareErrors,
};
