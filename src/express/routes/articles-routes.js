'use strict';

const {Router} = require(`express`);
const articlesRouter = new Router();
const {getAPI} = require(`../api`);
const api = getAPI();

const {upload} = require(`../middlewares`);
const {ensureArray, prepareErrors} = require(`../utils`);

const getAddArticleData = () => {
  return api.getCategories();
};
const getEditArticleData = async (articleId) => {
  const [article, categories] = await Promise.all([
    api.getArticle(articleId),
    api.getCategories()
  ]);
  return [article, categories];
};
const getViewArticleData = async (id, comments) => {
  return await api.getArticle(id, {comments});
};

articlesRouter.post(`/add`,
    upload.single(`upload`),
    async (req, res) => {
      const {body, file} = req;
      const newArticle = {
        announce: body.announcement,
        categories: ensureArray(body.categories),
        fullText: body[`full-text`],
        picture: file ? file.filename.split(`@1x`)[0] : ``,
        title: body.title,
      };
      console.log(`newArticle `, newArticle);
      try {
        await api.createArticle(newArticle);
        res.redirect(`/my`);
      } catch (errors) {
        const validationMessages = prepareErrors(errors);
        const categories = await getAddArticleData();
        res.render(`articles/new-post`, {categories, validationMessages});
      }
    }
);

articlesRouter.get(`/category/:id`, (req, res) => res.render(`articles/articles-by-category`));

articlesRouter.get(`/add`, async (req, res) => {
  const [categories] = await Promise.all([
    api.getCategories()
  ]);
  res.render(`articles/new-post`, {categories});
});

articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const [article, categories] = await getEditArticleData(id);

  res.render(`articles/edit-post`, {id, article, categories});
});

articlesRouter.post(`/edit/:id`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;
  const {id} = req.params;
  const articleData = {
    announce: body.announcement,
    categories: ensureArray(body.categories),
    fullText: body[`full-text`],
    picture: file ? file.filename.split(`.`)[0] : ``,
    title: body.title,
  };

  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const [article, categories] = await getEditArticleData(id);
    res.render(`articles/edit-post`, {id, article, categories, validationMessages});
  }
});

articlesRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const article = await getViewArticleData(id, true);
  res.render(`articles/post`, {article, id});
});

articlesRouter.post(`/:id/comments`, async (req, res) => {
  const {id} = req.params;
  const {comment} = req.body;
  try {
    await api.createComment(id, {text: comment});
    res.redirect(`/article/${id}`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const article = await getViewArticleData(id, true);
    res.render(`articles/post`, {article, id, validationMessages});
  }
});

module.exports = articlesRouter;
