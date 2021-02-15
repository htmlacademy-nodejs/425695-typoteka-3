'use strict';

const DEFAULT_COMMAND = `--help`;
const DEFAULT_COUNT = 1;
const ExitCode = {
  ERROR: 1,
  SUCCESS: 0,
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
  ExitCode,
  FILE_CATEGORIES_PATH,
  FILE_NAME,
  FILE_SENTENCES_PATH,
  FILE_TITLES_PATH,
  USER_ARGV_INDEX,
};
