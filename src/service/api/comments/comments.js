'use strict';

const {Router} = require('express');
const {HttpCode, SocketAction} = require('../../constants');
const {commentExist, routeParamsValidator} = require('../../middlewares');
const {emitHotArticlesUpdate} = require('../../lib/io-emmiters');

module.exports = (app, commentService, articleService) => {
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
    const {comment} = res.locals;
    const io = req.app.locals.socketio;

    const isInLastComments = await commentService.isInLast(commentId);
    const isDroped = await commentService.drop(commentId);

    if (isDroped) {
      if (isInLastComments) {
        const lastComments = await commentService.findLast();
        io.emit(SocketAction.UPDATE_LAST_COMMENTS, lastComments);
      }
      await emitHotArticlesUpdate({io, articleId: comment.articleId, articleService});
    }


    return res.status(HttpCode.OK).json(isDroped);
  });
};
