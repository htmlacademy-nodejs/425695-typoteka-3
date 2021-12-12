'use strict';

const fs = require('fs').promises;

const chalk = require('chalk');

const {getLogger} = require('../lib/logger');
const sequelize = require('../lib/sequelize');
const initDatabase = require('../lib/init-db');
const passwordUtils = require('../lib/password');

const {DEFAULT_ARTICLES_COUNT, FilePath, MaxCount} = require('../constants');
const {getRandomInt, shuffle} = require('../utils');

const logger = getLogger({name: 'filldb'});

const generateComments = (count, comments, users) => (
  Array(count).fill({}).map(() => ({
    user: users[getRandomInt(0, users.length - 1)].email,
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(' ')
  }))
);

const getRandomSubarray = (items) => {
  items = items.slice();
  let count = getRandomInt(1, items.length - 1);
  const result = [];
  while (count--) {
    result.push(
        ...items.splice(
            getRandomInt(0, items.length - 1), 1
        )
    );
  }
  return result;
};

const generateArticles = (count, titles, categories, sentences, comments, pictures, users) => (
  Array(count).fill({}).map(() => {
    return {
      announce: shuffle(sentences).slice(1, MaxCount.ANNOUNCE).join(' '),
      fullText: shuffle(sentences).slice(1, MaxCount.FULLTEXT).join(' '),
      picture: pictures[getRandomInt(1, pictures.length - 1)],
      user: users[getRandomInt(0, users.length - 1)].email,
      categories: getRandomSubarray(categories),
      Comments: generateComments(getRandomInt(1, MaxCount.COMMENTS), comments, users),
      title: titles[getRandomInt(0, titles.length - 1)],
      publishedAt: new Date(),
    };
  })
);

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, 'utf8');

    return content.split('\n').filter(Boolean);
  } catch (err) {
    logger.error(chalk.red(err));
    return [];
  }
};

module.exports = {
  name: '--filldb',
  async run(args) {
    try {
      logger.info('Trying to connect to database...');
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occured: ${err.message}`);
      process.exit(1);
    }
    logger.info('Connection to database established');

    const categories = await readContent(FilePath.CATEGORIES);
    const comments = await readContent(FilePath.COMMENTS);
    const pictures = await readContent(FilePath.PICTURES);
    const sentences = await readContent(FilePath.SENTENCES);
    const titles = await readContent(FilePath.TITLES);

    const users = [
      {
        name: 'Иван Иванов',
        email: 'ivanov@example.com',
        passwordHash: await passwordUtils.hash('ivanov'),
        avatar: 'avatar-1.png'
      },
      {
        name: 'Пётр Петров',
        email: 'petrov@example.com',
        passwordHash: await passwordUtils.hash('petrov'),
        avatar: 'avatar-2.png'
      }
    ];

    const [count] = args;
    const countArticle = Number.parseInt(count, 10) || DEFAULT_ARTICLES_COUNT;
    const articles = generateArticles(countArticle, titles, categories, sentences, comments, pictures, users);

    return initDatabase(sequelize, {articles, categories, users});
  }
};
