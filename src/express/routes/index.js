'use strict';

const articlesRouter = require(`./articles-routes`);
const categoriesRouter = require(`./categories-routes`);
const mainRouter = require(`./main-routes`);
const myRouter = require(`./my-routes`);

module.exports = {
  articlesRoutes: articlesRouter,
  categoriesRoutes: categoriesRouter,
  mainRoutes: mainRouter,
  myRoutes: myRouter,
};
