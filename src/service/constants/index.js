'use strict';

const API_PREFIX = `/api`;
const Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`
};

const DEFAULT_COMMAND = `--help`;
const DEFAULT_COUNT = 1;
const DEFAULT_PORT = 3000;
const ExitCode = {
  ERROR: 1,
  SUCCESS: 0,
};
const HttpCode = {
  CREATED: 201,
  OK: 200,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
};

const FILE_MOCKS_NAME = `mocks.json`;
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
const FILE_COMMENTS_PATH = `./data/comments.txt`;
const FILE_MOCKS_PATH = `./${FILE_MOCKS_NAME}`;
const FILE_LOG = `./src/service/logs/api.log`;

const MAX_COMMENTS = 4;
const MAX_ID_LENGTH = 6;

module.exports = {
  API_PREFIX,
  ANNOUNCE_MAX_COUNT,
  CreatedDateMs,
  DEFAULT_COMMAND,
  DEFAULT_COUNT,
  DEFAULT_PORT,
  Env,
  ExitCode,
  FILE_CATEGORIES_PATH,
  FILE_COMMENTS_PATH,
  FILE_LOG,
  FILE_MOCKS_NAME,
  FILE_MOCKS_PATH,
  FILE_SENTENCES_PATH,
  FILE_TITLES_PATH,
  HttpCode,
  MAX_COMMENTS,
  MAX_ID_LENGTH,
  USER_ARGV_INDEX,
};
