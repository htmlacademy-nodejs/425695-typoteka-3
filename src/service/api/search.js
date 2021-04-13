'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../constants`);

const route = new Router();

module.exports = (app, searchService) => {
  app.use(`/search`, route);

  route.get(`/`, (req, res) => {
    const {query = ``} = req.query;
    if (!query) {
      return res.status(HttpCode.BAD_REQUEST).json([]);
    }
    const foundArticles = searchService.findArticles(query);
    const status = foundArticles.length > 0 ? HttpCode.OK : HttpCode.NOT_FOUND;

    return res.status(status).json(foundArticles);
  });
};
