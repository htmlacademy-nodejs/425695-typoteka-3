'use strict';

const {Router} = require('express');

const categoriesRouter = new Router();
const csrf = require('csurf');
const {auth} = require('../middlewares');
const {getAPI} = require('../api');
const api = getAPI();
const {prepareErrors} = require('../utils');

const csrfProtection = csrf();

categoriesRouter.get('/', auth, csrfProtection, async (req, res) => {
  const [categories] = await Promise.all([
    api.getCategories({count: true}),
  ]);
  res.render('categories', {categories, csrfToken: req.csrfToken()});
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
  const {name} = req.body;

  try {
    await api.editCategory(id, {name});
    res.redirect('/categories');
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const categories = await api.getCategories({count: true});
    res.render('categories', {categories, validationMessages, csrfToken: req.csrfToken()});
  }
});


module.exports = categoriesRouter;
