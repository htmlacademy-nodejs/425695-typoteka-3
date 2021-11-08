'use strict';

const {Router} = require(`express`);
const categoriesRouter = new Router();
const {auth} = require(`../middlewares`);

categoriesRouter.get(`/`, auth, (req, res) => res.render(`categories`));

module.exports = categoriesRouter;
