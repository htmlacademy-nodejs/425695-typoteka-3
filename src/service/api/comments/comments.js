'use strict';

const {Router} = require(`express`);

const {HttpCode} = require(`../../constants`);

module.exports = (app, commentService) => {
  const route = new Router();

  app.use(`/comments`, route);

  route.get(`/`, (req, res) => {
    const comments = commentService.getAll();

    return res.status(HttpCode.OK).json(comments);
  });

};
