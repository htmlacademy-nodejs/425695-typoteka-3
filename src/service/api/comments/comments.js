'use strict';

const {Router} = require('express');
const {HttpCode, SocketAction} = require('../../constants');
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

    const isInLast = await commentService.isInLast(commentId);
    const dropedComment = await commentService.drop(commentId);

    if (isInLast) {
      const lastComments = await commentService.findLast();
      const io = req.app.locals.socketio;
      io.emit(SocketAction.UPDATE_IN_LAST_COMMENTS, lastComments);
    }
    return res.status(HttpCode.OK).json(dropedComment);
  });
};
