'use strict';

const API_PREFIX = '/api';
const DEFAULT_COMMAND = '--help';
const DEFAULT_ARTICLES_COUNT = 3;
const DEFAULT_PORT = 3000;
const USER_ARGV_INDEX = 2;
const FILE_MOCKS_NAME = 'mocks.json';
const DIR_LOG = './src/service/logs';

const Env = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production'
};

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

const MaxCount = {
  ANNOUNCE: 2,
  ARTICLES: 1000,
  COMMENTS: 4,
  FULLTEXT: 4,
};

const FilePath = {
  SENTENCES: './data/sentences.txt',
  TITLES: './data/titles.txt',
  CATEGORIES: './data/categories.txt',
  COMMENTS: './data/comments.txt',
  PICTURES: './data/pictures.txt',
  MOCKS: `./${FILE_MOCKS_NAME}`,
  LOG: `${DIR_LOG}/api.log`,
  FILL_DB: './queries/fill-db.sql',
};

const SocketAction = {
  ADD_LAST_COMMENT: 'lastComment:add',
  UPDATE_HOT_ARTICLES: 'hotArticles:update',
  UPDATE_LAST_COMMENTS: 'lastComments:update',
};

module.exports = {
  API_PREFIX,
  DEFAULT_COMMAND,
  DEFAULT_ARTICLES_COUNT,
  DEFAULT_PORT,
  DIR_LOG,
  Env,
  ExitCode,
  FilePath,
  FILE_MOCKS_NAME,
  HttpCode,
  MaxCount,
  SocketAction,
  USER_ARGV_INDEX,
};
