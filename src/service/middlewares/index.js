'use strict';

const commentValidator = require('./commentValidator');
const articleExist = require('./articleExist');
const categoryExist = require('./categoryExist');
const articleValidator = require('./articleValidator');
const categoryValidator = require('./categoryValidator');
const routeParamsValidator = require('./routeParamsValidator');
const userValidator = require('./userValidator');

module.exports = {
  commentValidator,
  articleExist,
  categoryExist,
  articleValidator,
  categoryValidator,
  routeParamsValidator,
  userValidator,
};
