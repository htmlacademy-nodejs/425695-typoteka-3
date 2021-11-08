'use strict';

const {Router} = require(`express`);
const myRouter = new Router();
const {getAPI} = require(`../api`);
const {auth} = require(`../middlewares`);
const api = getAPI();

myRouter.get(`/`, auth, async (req, res) => {
  const {user} = req.session;
  const [articles] = await Promise.all([
    api.getArticles({comments: false}),
  ]);
  res.render(`my`, {articles, user});
});
myRouter.get(`/comments`, auth, async (req, res) => {
  const articles = await api.getArticles({comments: true});
  res.render(`my/comments`, {articles: articles.slice(0, 3)});
});

module.exports = myRouter;
