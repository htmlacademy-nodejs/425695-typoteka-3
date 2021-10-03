'use strict';

const fill = require(`./fill`);
const filldb = require(`./filldb`);
const help = require(`./help`);
const server = require(`./server`);
const version = require(`./version`);

const Cli = {
  [fill.name]: fill,
  [filldb.name]: filldb,
  [help.name]: help,
  [server.name]: server,
  [version.name]: version,
};

module.exports = {
  Cli,
};
