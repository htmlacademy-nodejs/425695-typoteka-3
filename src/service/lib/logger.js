'use strict';

const fs = require('fs');

const pino = require('pino');

const {Env, FilePath, DIR_LOG} = require('../constants');

const isDevMode = process.env.NODE_ENV !== Env.PRODUCTION;
const defaultLogLevel = isDevMode ? 'debug' : 'error';

if (!fs.existsSync(DIR_LOG)) {
  fs.mkdirSync(DIR_LOG);
}

const logger = pino({
  name: 'base-logger',
  level: process.env.LOG_LEVEL || defaultLogLevel,
  prettyPrint: isDevMode
}, isDevMode ? process.stdout : pino.destination(FilePath.LOG));

module.exports = {
  logger,
  getLogger(options = {}) {
    return logger.child(options);
  }
};
