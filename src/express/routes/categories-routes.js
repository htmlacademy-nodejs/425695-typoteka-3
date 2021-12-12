'use strict';

const {Router} = require('express');
const csrf = require('csurf');
const {auth} = require('../middlewares');
const {getAPI} = require('../api');
const {prepareErrors} = require('../utils');

const categoriesRouter = new Router();
const api = getAPI();
const csrfProtection = csrf();

categoriesRouter.get('/', auth, csrfProtection, async (req, res, next) => {
  const {user} = req.session;
  try {
    const [categories] = await Promise.all([
      api.getCategories({count: true}),
    ]);
    res.render('categories', {categories, user, csrfToken: req.csrfToken()});
  } catch (error) {
    next(error);
  }
});

categoriesRouter.post('/add', auth, csrfProtection, async (req, res) => {
  const {body} = req;

  try {
    await api.createCategory({name: body['add-category']});

    res.redirect('/categories');
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const categories = await api.getCategories({count: true});
    res.render('categories', {categories, validationMessages, csrfToken: req.csrfToken()});
  }
});

categoriesRouter.post('/:id', auth, csrfProtection, async (req, res) => {
  const {id} = req.params;
  const {drop, name} = req.body;

  try {
    if (drop) {
      await api.dropCategory(id);
    } else {
      await api.editCategory(id, {name});
    }
    res.redirect('/categories');
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const categories = await api.getCategories({count: true});
    res.render('categories', {categories, validationMessages, csrfToken: req.csrfToken()});
  }
});

module.exports = categoriesRouter;
