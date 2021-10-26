'use strict';

const path = require(`path`);
const express = require(`express`);
const {DEFAULT_SERVER_PORT, PUBLIC_DIR, UPLOAD_DIR} = require(`./constants`);
const {articlesRoutes, categoriesRoutes, mainRoutes, myRoutes} = require(`./routes`);

const app = express();

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.static(path.resolve(__dirname, UPLOAD_DIR)));

app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.use(`/`, mainRoutes);
app.use(`/categories`, categoriesRoutes);
app.use(`/my`, myRoutes);
app.use(`/articles`, articlesRoutes);

app.listen(DEFAULT_SERVER_PORT);
