'use strict';

const getMockData = require(`./get-mock-data`);
const sequelize = require(`./sequelize`);
const initDatabase = require(`./init-db`);
const {getLogger, logger} = require(`./logger`);

module.exports = {
  getMockData,
  getLogger,
  initDatabase,
  logger,
  sequelize
};
