'use strict';

const {Router} = require('express');
const csrf = require('csurf');
const {getAPI} = require('../api');
const {auth} = require('../middlewares');

const api = getAPI();
const csrfProtection = csrf();
const myRouter = new Router();

myRouter.get('/', auth, csrfProtection, async (req, res, next) => {
  const {user} = req.session;
  try {
    let [articles] = await Promise.all([
      api.getArticles({comments: false, userId: user.id}),
    ]);
    res.render('my', {articles, csrfToken: req.csrfToken(), user});
  } catch (error) {
    next(error);
  }
});

myRouter.post('/', auth, csrfProtection, async (req, res, next) => {
  const {id} = req.body;

  try {
    await api.dropArticle(id);
    res.redirect('/my');
  } catch (error) {
    next(error);
  }
});

myRouter.get('/comments', auth, async (req, res, next) => {
  const {user} = req.session;
  try {
    const comments = await api.getComments({userId: user.id});
    res.render('my/comments', {comments, user});
  } catch (error) {
    next(error);
  }
});

myRouter.post('/comments/delete/:id', auth, async (req, res, next) => {
  const {id} = req.params;

  try {
    await api.dropComment(id);
    res.redirect('my/comments');
  } catch (error) {
    next(error);
  }
});

module.exports = myRouter;
