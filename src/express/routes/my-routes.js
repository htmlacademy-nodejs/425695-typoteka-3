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

  try {
    await api.dropArticle(id);
    res.redirect('/my');
  } catch (errors) {
    res.redirect('/my');
  }
});

myRouter.get('/comments', auth, async (req, res) => {
  const {user} = req.session;
  const comments = await api.getComments({userId: user.id});

  res.render('my/comments', {comments, user});
});

myRouter.post('/comments/delete/:id', auth, async (req, res) => {
  const {id} = req.params;

  await api.dropComment(id);
  res.redirect('my/comments');
});

module.exports = myRouter;
