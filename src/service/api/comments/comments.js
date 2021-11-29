'use strict';

const {Router} = require('express');
const {HttpCode} = require('../../constants');

module.exports = (app, commentService) => {
  const route = new Router();
  app.use('/comments', route);

  route.get('/', async (req, res) => {
    const {isLast = false, limit = null} = req.query;
    let comments = {};
    if (isLast) {
      comments = await commentService.findLast();
    } else {
      comments = await commentService.findAll({limit});
    }

    return res.status(HttpCode.OK).json(comments);
  });
};
