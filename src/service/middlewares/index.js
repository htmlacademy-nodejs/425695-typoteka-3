'use strict';

const commentValidator = require(`./commentValidator`);
const articleExist = require(`./articleExist`);
const articleValidator = require(`./articleValidator`);

module.exports = {
  commentValidator,
  articleExist,
  articleValidator
};
