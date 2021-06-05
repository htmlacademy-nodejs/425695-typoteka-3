'use strict';

const {Router} = require(`express`);
const myRouter = new Router();
const {getAPI} = require(`../api`);
const api = getAPI();

myRouter.get(`/`, async (req, res) => {
  const [articles] = await Promise.all([
    api.getArticles(),
  ]);
  res.render(`my`, {articles});
});
myRouter.get(`/comments`, async (req, res) => {
  const [comments] = await Promise.all([
    api.getAllComments(),
  ]);
  res.render(`my/comments`, {comments});
});

module.exports = myRouter;
