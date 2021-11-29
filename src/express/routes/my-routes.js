'use strict';

const {Router} = require('express');
const csrf = require('csurf');

const csrfProtection = csrf();
const myRouter = new Router();
const {getAPI} = require('../api');
const {auth} = require('../middlewares');
const api = getAPI();

myRouter.get('/', auth, csrfProtection, async (req, res) => {
  const {user} = req.session;
  let [articles] = await Promise.all([
    api.getArticles({comments: false, userId: user.id}),
  ]);
  res.render('my', {articles, csrfToken: req.csrfToken(), user});
});

myRouter.post('/', auth, csrfProtection, async (req, res) => {
  const {id} = req.body;
  delete req.body._csrf;

  try {
    await api.dropArticle(id);
    res.redirect('/my');
  } catch (errors) {
    res.redirect('/my');
  }
});

myRouter.get('/comments', auth, async (req, res) => {
  const articles = await api.getArticles({comments: true});
  res.render('my/comments', {articles: articles.slice(0, 3)});
});

module.exports = myRouter;
