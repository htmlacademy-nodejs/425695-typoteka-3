'use strict';

const {Router} = require('express');
const csrf = require('csurf');
let dayjs = require('dayjs');
const {getAPI} = require('../api');
const api = getAPI();

const articlesRouter = new Router();

const csrfProtection = csrf();
const {auth, upload} = require('../middlewares');
const {ensureArray, prepareErrors} = require('../utils');
const ARTICLES_PER_PAGE = 8;

const getAddArticleData = async () => {
  return await api.getCategories({count: false});
};
const getEditArticleData = async (articleId) => {
  const [article, categories] = await Promise.all([
    api.getArticle(articleId, {comments: false}),
    api.getCategories({count: true})
  ]);
  return [article, categories];
};
const getViewArticleData = async (id, comments) => {
  return await api.getArticle(id, {comments});
};

articlesRouter.post('/add',
    auth,
    upload.single('upload'),
    csrfProtection,
    async (req, res) => {
      const {body, file} = req;
      const {user} = req.session;

      const newArticle = {
        announce: body.announcement,
        categories: ensureArray(body.categories),
        fullText: body['full-text'],
        picture: file ? file.filename.split('@1x')[0] : '',
        title: body.title,
        publishedAt: body.date,
        userId: user.id,
      };

      try {
        await api.createArticle(newArticle);
        res.redirect('/my');
      } catch (errors) {
        const validationMessages = prepareErrors(errors);
        const categories = await getAddArticleData();
        res.render('articles/new-post', {categories, validationMessages, csrfToken: req.csrfToken()});
      }
    }
);

articlesRouter.get('/category/:id', async (req, res) => {
  const categoryId = Number(req.params.id);
  const {user} = req.session;
  let {page = 1} = req.query;

  page = +page;
  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;
  const [{articles, count}, categories] = await Promise.all([
    api.getArticles({categoryId, comments: true, limit, offset}),
    api.getCategories({count: true}),
  ]);
  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);
  const activeCategory = categories.find(({id}) => id === categoryId);
  if (!activeCategory) {
    // res.status(StatusCodes.NOT_FOUND).render(`400`);
    res.render('400');
  }

  res.render('articles/by-category', {activeCategory, articles, page, totalPages, categories, user});
});

articlesRouter.get('/add', auth, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const [categories] = await Promise.all([
    api.getCategories({count: false})
  ]);
  const today = dayjs(new Date()).format('YYYY-MM-DD');
  res.render('articles/new-post', {categories, today, user, csrfToken: req.csrfToken()});
});

articlesRouter.get('/edit/:id', auth, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const backUrl = req.headers.referer;
  const [article, categories] = await getEditArticleData(id);

  res.render('articles/edit-post', {id, article, backUrl, categories, user, csrfToken: req.csrfToken()});
});

articlesRouter.post('/edit/:id', auth, upload.single('upload'), csrfProtection, async (req, res) => {
  const {body, file} = req;
  const {id} = req.params;
  const {user} = req.session;
  const backUrl = req.headers.referer;

  const articleData = {
    announce: body.announcement,
    categories: ensureArray(body.categories),
    fullText: body['full-text'],
    picture: file ? file.filename.split('@1x')[0] : body.photo || '',
    title: body.title,
    publishedAt: body.date,
    userId: user.id,
  };

  try {
    await api.editArticle(id, articleData);
    res.redirect('/my');
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const [article, categories] = await getEditArticleData(id);
    res.render('articles/edit-post', {id, article, backUrl, categories, validationMessages});
  }
});

articlesRouter.get('/:id', csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const backUrl = req.headers.referer;
  const article = await getViewArticleData(id, true);
  const isAuthor = !!user && user.id === article.userId;

  res.render('articles/post', {article, backUrl, id, isAuthor, user, csrfToken: req.csrfToken(), validationMessages: []});
});

articlesRouter.post('/:id', auth, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const {comment} = req.body;

  try {
    await api.createComment(id, {text: comment, userId: user.id});
    res.redirect(`/articles/${id}`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const article = await getViewArticleData(id, true);
    res.render('articles/post', {article, id, user, validationMessages, csrfToken: req.csrfToken()});
  }
});

module.exports = articlesRouter;
