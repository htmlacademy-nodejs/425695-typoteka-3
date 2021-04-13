'use strict';

const {Router} = require(`express`);

const articles = require(`./articles`);
const categories = require(`./categories`);
const search = require(`./search`);

const {getMockData} = require(`../lib`);
const {
  ArticleService,
  CategoryService,
  SearchService,
  CommentService,
} = require(`../data-service`);

const app = new Router();

(async () => {
  const mockData = await getMockData();

  articles(app, new ArticleService(mockData), new CommentService(mockData));
  categories(app, new CategoryService(mockData));
  search(app, new SearchService(mockData));
})();

module.exports = app;
