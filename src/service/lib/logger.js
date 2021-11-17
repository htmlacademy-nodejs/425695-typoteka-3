'use strict';

const fs = require('fs');

const pino = require('pino');

const {Env, FILE_LOG, DIR_LOG} = require('../constants');

const isDevMode = process.env.NODE_ENV === Env.DEVELOPMENT;
const defaultLogLevel = isDevMode ? 'info' : 'error';

if (!fs.existsSync(DIR_LOG)) {
  fs.mkdirSync(DIR_LOG);
}

const logger = pino({
  name: 'base-logger',
  level: process.env.LOG_LEVEL || defaultLogLevel,
  prettyPrint: isDevMode
}, isDevMode ? process.stdout : pino.destination(FILE_LOG));

module.exports = {
  logger,
  getLogger(options = {}) {
    return logger.child(options);
  }
};
