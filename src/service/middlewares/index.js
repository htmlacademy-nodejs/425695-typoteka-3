'use strict';

const commentValidator = require('./commentValidator');
const articleExist = require('./articleExist');
const categoryExist = require('./categoryExist');
const commentExist = require('./commentExist');
const articleValidator = require('./articleValidator');
const categoryValidator = require('./categoryValidator');
const routeParamsValidator = require('./routeParamsValidator');
const userValidator = require('./userValidator');

module.exports = {
  commentValidator,
  articleExist,
  categoryExist,
  commentExist,
  articleValidator,
  categoryValidator,
  routeParamsValidator,
  userValidator,
};
