'use strict';

const fs = require('fs').promises;

const {FilePath} = require('../constants');
const {getLogger} = require('./logger');


const logger = getLogger({name: 'get.mock.data'});

let data = [];

const getMockData = async () => {
  if (data.length > 0) {
    return Promise.resolve(data);
  }

  try {
    const fileContent = await fs.readFile(FilePath.MOCKS);
    data = JSON.parse(fileContent);
  } catch (err) {
    logger.error(err);
  }

  return Promise.resolve(data);
};

module.exports = getMockData;
