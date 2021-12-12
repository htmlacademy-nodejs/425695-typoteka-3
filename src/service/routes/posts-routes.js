'use strict';

const fs = require('fs').promises;

const {Router} = require('express');
const {FILE_MOCKS_NAME} = require('../constants');

const postsRouter = new Router();

postsRouter.get('/', async (req, res) => {
  let mocks;
  try {
    const fileContent = await fs.readFile(FILE_MOCKS_NAME);
    mocks = JSON.parse(fileContent);
  } catch (err) {
    mocks = [];
  }
  res.json(mocks);
});

module.exports = postsRouter;
