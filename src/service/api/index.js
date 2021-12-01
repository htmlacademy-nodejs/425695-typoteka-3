'use strict';

const {Router} = require('express');

const {
  ArticleService,
  CategoryService,
  SearchService,
  CommentService,
  UserService,
} = require('../data-service');
const sequelize = require('../lib/sequelize');
const defineModels = require('../models');
const articles = require('./articles/articles');
const categories = require('./categories/categories');
const comments = require('./comments/comments');
const search = require('./search/search');
const user = require('./user/user');


const app = new Router();

defineModels(sequelize);

(async () => {
  user(app, new UserService(sequelize));
  articles(app, new ArticleService(sequelize), new CommentService(sequelize));
  categories(app, new CategoryService(sequelize));
  comments(app, new CommentService(sequelize));
  search(app, new SearchService(sequelize));
})();

module.exports = app;
