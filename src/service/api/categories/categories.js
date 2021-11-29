'use strict';

const {Router} = require('express');

const {HttpCode} = require('../../constants');
const {categoryValidator} = require('../../middlewares');


module.exports = (app, categoryService) => {
  const route = new Router();

  app.use('/categories', route);

  route.get('/', async (req, res) => {
    const {count} = req.query;
    const categories = await categoryService.findAll(count);

    res.status(HttpCode.OK).json(categories);
  });

  route.post('/', categoryValidator, async (req, res) => {
    const category = await categoryService.create(req.body);

    res.status(HttpCode.OK).json(category);
  });

  route.put('/:categoryId', categoryValidator, async (req, res) => {
    const {categoryId} = req.params;
    const updated = await categoryService.update(categoryId, req.body);

    res.status(HttpCode.OK).json(updated);
  });
};
