'use strict';

const {Router} = require(`express`);
const {getAPI} = require(`../api`);
const mainRouter = new Router();
const api = getAPI();
const {upload} = require(`../middlewares`);
const {prepareErrors} = require(`../utils`);

const OFFERS_PER_PAGE = 8;

mainRouter.get(`/`, async (req, res) => {
  let {page = 1} = req.query;
  page = +page;
  const limit = OFFERS_PER_PAGE;
  const offset = (page - 1) * OFFERS_PER_PAGE;
  const [
    {articles, count},
    categories
  ] = await Promise.all([
    api.getArticles({comments: true, limit, offset}),
    api.getCategories(true)
  ]);

  const totalPages = Math.ceil(count / OFFERS_PER_PAGE);

  res.render(`main`, {articles, page, totalPages, categories});
});

mainRouter.get(`/register`, (req, res) => res.render(`main/sign-up`));

mainRouter.post(`/register`, upload.single(`upload`), async (req, res) => {
  const {body, file} = req;

  const userData = {
    avatar: file ? file.filename.split(`@1x`)[0] : ``,
    name: `${body[`name`]} ${body[`surname`]}`,
    email: body[`email`],
    password: body[`password`],
    passwordRepeated: body[`repeat-password`]
  };

  try {
    await api.createUser(userData);
    res.redirect(`/login`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    res.render(`main/sign-up`, {validationMessages});
  }
});

mainRouter.get(`/login`, (req, res) => res.render(`main/login`));
mainRouter.get(`/search`, async (req, res) => {
  const {search} = req.query;
  try {
    const results = await api.search(search);

    res.render(`main/search`, {
      results,
      searchText: search,
    });
  } catch (error) {
    res.render(`main/search`, {
      results: [],
      searchText: search,
    });
  }
});
module.exports = mainRouter;
