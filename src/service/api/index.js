'use strict';

const {Router} = require(`express`);

const articles = require(`./articles/articles`);
const categories = require(`./categories/categories`);
const search = require(`./search/search`);
const user = require(`./user/user`);

const {
  ArticleService,
  CategoryService,
  SearchService,
  CommentService,
  UserService,
} = require(`../data-service`);

const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);

const app = new Router();

defineModels(sequelize);

(async () => {
  user(app, new UserService(sequelize));
  articles(app, new ArticleService(sequelize), new CommentService(sequelize));
  categories(app, new CategoryService(sequelize));
  search(app, new SearchService(sequelize));
})();

module.exports = app;
