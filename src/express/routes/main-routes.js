'use strict';

const {Router} = require('express');
const {prepareErrors} = require('../utils');
const {getAPI} = require('../api');
const {upload} = require('../middlewares');
const {ARTICLES_PER_PAGE} = require('../constants');

const mainRouter = new Router();
const api = getAPI();

mainRouter.get('/', async (req, res, next) => {
  const {user} = req.session;
  let {page = 1} = req.query;

  page = +page;
  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;
  try {
    const [{articles, count}, categories, hotArticles, lastComments] = await Promise.all([
      api.getArticles({comments: true, limit, offset}),
      api.getCategories({count: true}),
      api.getArticles({isHot: true}),
      api.getComments({isLast: true})
    ]);

    const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);
    res.render('main', {articles, hotArticles, lastComments, page, totalPages, categories, user});
  } catch (error) {
    next(error);
  }
});

mainRouter.get('/register', (req, res) => {
  const {user} = req.session;

  res.render('main/sign-up', {user});
});

mainRouter.post('/register', upload.single('upload'), async (req, res) => {
  const {body, file} = req;

  const userData = {
    avatar: file ? file.filename : '',
    name: `${body['name']} ${body['surname']}`,
    email: body['email'],
    password: body['password'],
    passwordRepeated: body['repeat-password']
  };

  try {
    await api.createUser(userData);
    res.redirect('/login');
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    res.render('main/sign-up', {validationMessages});
  }
});

mainRouter.get('/login', (req, res) => {
  const {user} = req.session;

  res.render('main/login', {user});
});

mainRouter.post('/login', async (req, res) => {
  try {
    const user = await api.auth(req.body['email'], req.body['password']);
    req.session.user = user;
    req.session.save(() => {
      res.redirect('/');
    });
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const {user} = req.session;
    res.render('main/login', {user, validationMessages});
  }
});

mainRouter.get('/logout', (req, res) => {
  delete req.session.user;
  res.redirect('/');
});

mainRouter.get('/search', async (req, res) => {
  const {search} = req.query;
  let isNoMatches;
  if (!search) {
    res.render('main/search', {isNoMatches: false, results: [], searchText: search});
  } else {
    try {
      const results = await api.search(search);

      res.render('main/search', {isNoMatches, results, searchText: search});
    } catch (error) {
      res.render('main/search', {isNoMatches: true, results: [], searchText: search});
    }
  }

});

module.exports = mainRouter;
