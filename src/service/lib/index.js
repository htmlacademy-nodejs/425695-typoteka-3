'use strict';

const getMockData = require(`./get-mock-data`);
const sequelize = require(`./sequelize`);
const {getLogger, logger} = require(`./logger`);

module.exports = {
  getMockData,
  getLogger,
  logger,
  sequelize
};
