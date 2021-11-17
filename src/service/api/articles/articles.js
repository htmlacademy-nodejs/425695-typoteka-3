'use strict';

const {Router} = require('express');

const {HttpCode} = require('../../constants');
const {commentValidator, articleExist, articleValidator, routeParamsValidator} = require('../../middlewares');


module.exports = (app, articleService, commentService) => {
  const route = new Router();

  app.use('/articles', route);

  route.get('/', async (req, res) => {
    const {offset, limit, comments} = req.query;
    let result;
    if (limit || offset) {
      result = await articleService.findPage({comments, limit, offset});
    } else {
      result = await articleService.findAll(comments);
    }

    res.status(HttpCode.OK).json(result);
  });

  route.get('/:articleId', [articleExist(articleService), routeParamsValidator], (req, res) => {
    const {article} = res.locals;

    return res.status(HttpCode.OK).json(article);
  });

  route.post('/', articleValidator, async (req, res) => {
    const article = await articleService.create(req.body);

    return res.status(HttpCode.CREATED).json(article);
  });

  route.put('/:articleId', [articleExist(articleService), routeParamsValidator, articleValidator], async (req, res) => {
    const {articleId} = req.params;
    const updatedArticle = await articleService.update(articleId, req.body);

    return res.status(HttpCode.OK).json(updatedArticle);
  });

  route.delete('/:articleId', [articleExist(articleService), routeParamsValidator], async (req, res) => {
    const {articleId} = req.params;

    const dropedArticle = await articleService.drop(articleId);
    return res.status(HttpCode.OK).json(dropedArticle);
  });

  route.get('/:articleId/comments', [articleExist(articleService), routeParamsValidator], (req, res) => {
    const {article} = res.locals;
    // console.log(`article `, article);
    return res.status(HttpCode.OK).json(article.comments);
  });

  route.delete('/:articleId/comments/:commentId', [articleExist(articleService), routeParamsValidator], async (req, res) => {
    const {commentId} = req.params;

    const {comment} = await commentService.drop(commentId);

    if (!comment) {
      return res.status(HttpCode.NOT_FOUND).send(`Comment with ${commentId} not found`);
    }

    return res.status(HttpCode.NO_CONTENT).send('Comment deleted');
  });

  route.post('/:articleId/comments', [articleExist(articleService), routeParamsValidator, commentValidator], async (req, res) => {
    const {articleId} = req.params;

    const comment = await commentService.create(articleId, req.body);

    return res.status(HttpCode.CREATED).json(comment);
  });
};
