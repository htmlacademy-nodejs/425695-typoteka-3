'use strict';

const DEFAULT_COMMAND = `--help`;
const DEFAULT_COUNT = 1;
const DEFAULT_PORT = 3000;
const ExitCode = {
  ERROR: 1,
  SUCCESS: 0,
};
const HttpCode = {
  OK: 200,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
};

const FILE_NAME = `mocks.json`;
const USER_ARGV_INDEX = 2;

const currentDate = new Date();
const MONTHS_WITHIN_COUNT = 3;
const CreatedDateMs = {
  MAX: currentDate.getTime(),
  MIN: new Date(currentDate.setMonth(currentDate.getMonth() - MONTHS_WITHIN_COUNT)).getTime(),
};

const ANNOUNCE_MAX_COUNT = 5;

const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;

module.exports = {
  ANNOUNCE_MAX_COUNT,
  CreatedDateMs,
  DEFAULT_COMMAND,
  DEFAULT_COUNT,
  DEFAULT_PORT,
  ExitCode,
  FILE_CATEGORIES_PATH,
  FILE_NAME,
  FILE_SENTENCES_PATH,
  FILE_TITLES_PATH,
  HttpCode,
  USER_ARGV_INDEX,
};
