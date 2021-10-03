'use strict';

const {Router} = require(`express`);

const articles = require(`./articles/articles`);
const categories = require(`./categories/categories`);
const search = require(`./search/search`);

const {
  ArticleService,
  CategoryService,
  SearchService,
  CommentService,
} = require(`../data-service`);

const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);

const app = new Router();

defineModels(sequelize);

(async () => {
  articles(app, new ArticleService(sequelize), new CommentService(sequelize));
  categories(app, new CategoryService(sequelize));
  search(app, new SearchService(sequelize));
})();

module.exports = app;
