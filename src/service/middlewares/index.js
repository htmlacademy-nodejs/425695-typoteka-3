'use strict';

const commentValidator = require('./comment-validator');
const articleExist = require('./article-exist');
const categoryExist = require('./category-exist');
const commentExist = require('./comment-exist');
const articleValidator = require('./article-validator');
const categoryValidator = require('./category-validator');
const routeParamsValidator = require('./route-params-validator');
const userValidator = require('./user-validator');

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
