'use strict';

const {Router} = require('express');
const {HttpCode} = require('../../constants');
const {commentExist, routeParamsValidator} = require('../../middlewares');

module.exports = (app, commentService) => {
  const route = new Router();
  app.use('/comments', route);

  route.get('/', async (req, res) => {
    const {isLast = false, limit = null, userId = null} = req.query;
    let comments = {};
    if (isLast) {
      comments = await commentService.findLast();
    } else {
      comments = await commentService.findAll({limit, userId});
    }

    return res.status(HttpCode.OK).json(comments);
  });


  route.delete('/:commentId', [commentExist(commentService), routeParamsValidator], async (req, res) => {
    const {commentId} = req.params;

    const dropedComment = await commentService.drop(commentId);

    return res.status(HttpCode.OK).json(dropedComment);
  });
};
