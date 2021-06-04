'use strict';

const {Router} = require(`express`);
const articlesRouter = new Router();
const {getAPI} = require(`../api`);
const api = getAPI();

const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);

const UPLOAD_DIR = `../upload/img/`;

const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  }
});

const upload = multer({storage});

articlesRouter.post(`/add`,
    upload.single(`upload`),
    async (req, res) => {
      const {body, file} = req;
      const newArticle = {
        announce: body.announcement,
        categories: body.categories || [],
        createdDate: body.date,
        fullText: body[`full-text`],
        picture: file ? file.filename : ``,
        title: body.title,
      };

      try {
        await api.createArticle(newArticle);
        res.redirect(`/my`);
      } catch (e) {
        res.redirect(`back`);
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
  const [article, categories] = await Promise.all([
    api.getArticle(id),
    api.getCategories()
  ]);
  res.render(`articles/edit-post`, {article, categories});
});
articlesRouter.get(`/:id`, (req, res) => res.render(`articles/post`));

module.exports = articlesRouter;
