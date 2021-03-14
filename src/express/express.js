'use strict';

const express = require(`express`);
const {DEFAULT_SERVER_PORT} = require(`./constants`);
const {articlesRoutes, categoriesRoutes, mainRoutes, myRoutes} = require(`./routes`);

const app = express();

app.use(`/`, mainRoutes);
app.use(`/categories`, categoriesRoutes);
app.use(`/my`, myRoutes);
app.use(`/articles`, articlesRoutes);

app.listen(DEFAULT_SERVER_PORT);
