'use strict';

const {Router} = require(`express`);

const {HttpCode} = require(`../constants`);
const {commentValidator, articleExist, articleValidator} = require(`../middlewares`);

const route = new Router();

module.exports = (app, articleService, commentService) => {
  app.use(`/articles`, route);

  route.get(`/`, (req, res) => {
    const articles = articleService.findAll();

    return res.status(HttpCode.OK).json(articles);
  });

  route.get(`/:articleId`, articleExist(articleService), (req, res) => {
    const {article} = res.locals;

    return res.status(HttpCode.OK).json(article);
  });

  route.post(`/`, articleValidator, (req, res) => {
    const article = articleService.create(req.body);

    return res.status(HttpCode.CREATED).json(article);
  });

  route.put(`/:articleId`, [articleExist(articleService), articleValidator], (req, res) => {
    const {articleId} = req.params;

    articleService.update(articleId, req.body);

    return res.status(HttpCode.NO_CONTENT);
  });

  route.delete(`/:articleId`, articleExist(articleService), (req, res) => {
    const {articleId} = req.params;

    articleService.drop(articleId);

    return res.status(HttpCode.NO_CONTENT);
  });

  route.get(`/:articleId/comments`, articleExist(articleService), (req, res) => {
    const {article} = res.locals;

    return res.status(HttpCode.OK).json(article.comments);
  });

  route.delete(`/:articleId/comments/:commentId`, articleExist(articleService), (req, res) => {
    const {articleId, commentId} = req.params;

    const {comment} = commentService.drop(articleId, commentId);

    if (!comment) {
      return res.status(HttpCode.NOT_FOUND).send(`Comment with ${commentId} not found`);
    }

    return res.status(HttpCode.NO_CONTENT);
  });

  route.post(`/:articleId/comments`, [articleExist(articleService), commentValidator], (req, res) => {
    const {articleId} = req.params;

    const comment = commentService.create(articleId, req.body.text);

    return res.status(HttpCode.CREATED).json(comment);
  });
};
