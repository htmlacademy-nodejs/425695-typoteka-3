'use strict';

const fs = require('fs').promises;

const chalk = require('chalk');

const {getLogger} = require('../lib/logger');
const {DEFAULT_ARTICLES_COUNT, ExitCode, FilePath, MaxCount} = require('../constants');
const {getRandomInt, shuffle} = require('../utils');

const logger = getLogger({name: 'fill'});

const getUserId = (userCount) => {
  return getRandomInt(1, userCount);
};

const generateComments = (articleId, count, comments, userCount) => (
  Array(count).fill({}).map(() => ({
    userId: getUserId(userCount),
    articleId,
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(' '),
  }))
);

const generateArticles = (count, categoryCount, sentences, titles, comments, pictures, userCount) => (
  Array(count).fill({}).map((_, articleIdx) => {
    const articleId = articleIdx + 1;

    return {
      announce: shuffle(sentences).slice(1, MaxCount.ANNOUNCE).join(' '),
      category: [getRandomInt(1, categoryCount)],
      comments: generateComments(articleId, getRandomInt(1, MaxCount.COMMENTS), comments, userCount),
      fullText: shuffle(sentences).slice(1, getRandomInt(1, sentences.length - 1)).join(' '),
      id: articleId,
      picture: pictures[getRandomInt(1, pictures.length - 1)],
      title: titles[getRandomInt(0, titles.length - 1)],
      userId: getUserId(userCount),
    };
  })
);

const users = [
  {
    email: 'ivanov@example.com',
    passwordHash: '5f4dcc3b5aa765d61d8327deb882cf99',
    firstName: 'Иван',
    lastName: 'Иванов',
    avatar: 'avatar1.jpg'
  },
  {
    email: 'petrov@example.com',
    passwordHash: '5f4dcc3b5aa765d61d8327deb882cf99',
    firstName: 'Пётр',
    lastName: 'Петров',
    avatar: 'avatar2.jpg'
  }
];

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
  name: '--fill',
  async run(args) {
    const categories = await readContent(FilePath.CATEGORIES);
    const commentSentences = await readContent(FilePath.COMMENTS);

    const pictures = await readContent(FilePath.PICTURES);
    const sentences = await readContent(FilePath.SENTENCES);
    const titles = await readContent(FilePath.TITLES);

    const [count] = args;
    const countArticle = Number.parseInt(count, 10) || DEFAULT_ARTICLES_COUNT;
    if (countArticle > MaxCount.ARTICLES) {
      logger.info(chalk.red(`Не больше ${MaxCount.ARTICLES} публикаций.`));
      process.exit(ExitCode.ERROR);
    }

    const articles = generateArticles(countArticle, categories.length, sentences, titles, commentSentences, pictures, users.length);
    const comments = articles.flatMap((article) => article.comments);
    const articleCategories = articles.map((article) => ({articleId: article.id, categoryId: article.category[0]}));

    const categoryValues = categories.map((name, idx) => `(${idx + 1}, '${name}')`).join(',\n\t');
    const userValues = users.map(({email, passwordHash, firstName, lastName, avatar}, idx) =>
      `(${idx + 1}, '${email}', '${passwordHash}', '${firstName}', '${lastName}', '${avatar}')`
    ).join(',\n\t');
    const articleValues = articles.map(({id, title, announce, fullText, picture, userId}) =>
      `(${id}, '${title}', '${announce}', '${fullText}', '${picture}', ${userId})`
    ).join(',\n\t');
    const commentValues = comments.map(({text, userId, articleId}, idx) => `(${idx + 1}, ${articleId}, ${userId}, '${text}')`).join(',\n\t');
    const articleCategoryValues = articleCategories.map(({articleId, categoryId}) => `(${articleId}, ${categoryId})`).join(',\n\t');

    const content = `
INSERT INTO users(id, email, password_hash, first_name, last_name, avatar) VALUES
  ${userValues};
INSERT INTO categories(id, name) VALUES
  ${categoryValues};
ALTER TABLE articles DISABLE TRIGGER ALL;
INSERT INTO articles(id, title, announce, full_text, picture, user_id) VALUES
  ${articleValues};
ALTER TABLE articles ENABLE TRIGGER ALL;
ALTER TABLE article_categories DISABLE TRIGGER ALL;
INSERT INTO article_categories(article_id, category_id) VALUES
  ${articleCategoryValues};
ALTER TABLE article_categories ENABLE TRIGGER ALL;
ALTER TABLE comments DISABLE TRIGGER ALL;
INSERT INTO comments(id, article_id, user_id, text) VALUES
  ${commentValues};
ALTER TABLE comments ENABLE TRIGGER ALL;`;

    try {
      await fs.writeFile(FilePath.FILL_DB, content);
      logger.info(chalk.green('Operation success. File created.'));
    } catch (err) {
      logger.error(chalk.red('Can\'t write data to file...'));
    }
  }
};
