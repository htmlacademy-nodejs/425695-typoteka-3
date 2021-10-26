'use strict';

const commentValidator = require(`./commentValidator`);
const articleExist = require(`./articleExist`);
const articleValidator = require(`./articleValidator`);
const routeParamsValidator = require(`./routeParamsValidator`);

module.exports = {
  commentValidator,
  articleExist,
  articleValidator,
  routeParamsValidator
};
