'use strict';

const http = require('http');
const express = require('express');
const socket = require('../lib/socket');
const {getLogger} = require('../lib/logger');
const sequelize = require('../lib/sequelize');
const routes = require('../api/routes');
const {API_PREFIX, DEFAULT_PORT, ExitCode, HttpCode} = require('../constants');

const app = express();
const server = http.createServer(app);

const io = socket(server);
app.locals.socketio = io;

module.exports = {
  name: '--server',
  async run(args) {
    const logger = getLogger({name: 'api'});

    try {
      logger.info('Trying to connect to database...');
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occurred: ${err.message}`);
      process.exit(ExitCode.ERROR);
    }

    logger.info('Connection to database established');

    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;


    app.use(express.json());

    app.use(API_PREFIX, routes);

    app.use((req, res) => {
      res.status(HttpCode.NOT_FOUND).send('Not found');
      logger.error(`Route not found: ${req.url}`);
    });

    app.use((err, _req, _res, _next) => {
      logger.error(`An error occurred on processing request: ${err.message}`);
    });

    app.use((req, res, next) => {
      logger.debug(`Request on route ${req.url}`);
      res.on('finish', () => {
        logger.info(`Response status code ${res.statusCode}`);
      });
      next();
    });

    try {
      server.listen(port, (error) => {
        if (error) {
          return logger.error(`An error occurred on server creation: ${error.message}`);
        }

        return logger.info(`Listening to connections on ${port}`);
      });
    } catch (error) {
      logger.error(`An error occured: ${error.message}`);
      process.exit(ExitCode.ERROR);
    }
  }
};
