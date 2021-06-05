'use strict';

const {Router} = require(`express`);
const {getAPI} = require(`../api`);
const mainRouter = new Router();
const api = getAPI();

mainRouter.get(`/`, async (req, res) => {
  const [articles] = await Promise.all([
    api.getArticles(),
  ]);
  res.render(`main`, {articles});
});
mainRouter.get(`/register`, (req, res) => res.render(`main/sign-up`));
mainRouter.get(`/login`, (req, res) => res.render(`main/login`));
mainRouter.get(`/search`, async (req, res) => {
  const {search} = req.query;
  try {
    const results = await api.search(search);

    res.render(`main/search`, {
      results,
      searchText: search,
    });
  } catch (error) {
    res.render(`main/search`, {
      results: [],
      searchText: search,
    });
  }
});
module.exports = mainRouter;
