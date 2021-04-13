'use strict';

const express = require(`express`);
const app = express();

const routes = require(`../api`);
const {API_PREFIX, DEFAULT_PORT, HttpCode} = require(`../constants`);

app.use(express.json());

app.use(API_PREFIX, routes);

app.use((req, res) => res
  .status(HttpCode.NOT_FOUND)
  .send(`Not found`));


module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    app.listen(port);
  }
};
