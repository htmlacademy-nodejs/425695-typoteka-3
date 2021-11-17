'use strict';

const commentValidator = require('./commentValidator');
const articleExist = require('./articleExist');
const articleValidator = require('./articleValidator');
const routeParamsValidator = require('./routeParamsValidator');
const userValidator = require('./userValidator');

module.exports = {
  commentValidator,
  articleExist,
  articleValidator,
  routeParamsValidator,
  userValidator,
};
