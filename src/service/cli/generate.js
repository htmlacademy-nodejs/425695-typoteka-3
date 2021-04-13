'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {nanoid} = require(`nanoid`);

const {
  ANNOUNCE_MAX_COUNT,
  CreatedDateMs,
  DEFAULT_COUNT,
  ExitCode,
  FILE_CATEGORIES_PATH,
  FILE_COMMENTS_PATH,
  FILE_MOCKS_NAME,
  FILE_SENTENCES_PATH,
  FILE_TITLES_PATH,
  MAX_COMMENTS,
  MAX_ID_LENGTH,
} = require(`../constants`);
const {
  getRandomInt,
  shuffle,
} = require(`../utils`);

const getCategories = (categories) => {
  const categoriesLength = getRandomInt(1, categories.length - 1);
  return Array.from(new Set(Array(categoriesLength)
  .fill(``)
  .map(() => categories[getRandomInt(0, categoriesLength)])));
};

const generateComments = (count, comments) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }))
);

const generateArticles = (count, categories, sentences, titles, comments) => (
  Array(count).fill({}).map(() => ({
    announce: shuffle(sentences).slice(1, ANNOUNCE_MAX_COUNT).join(` `),
    categories: getCategories(categories),
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments),
    createdDate: new Date(getRandomInt(CreatedDateMs.MIN, CreatedDateMs.MAX)),
    id: nanoid(MAX_ID_LENGTH),
    title: titles[getRandomInt(0, titles.length - 1)],
    fullText: shuffle(sentences).slice(1, getRandomInt(0, sentences.length - 1)).join(` `),
  }))
);

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);

    return content.split(`\n`).filter(Boolean);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

module.exports = {
  name: `--generate`,
  async run(args) {
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const comments = await readContent(FILE_COMMENTS_PATH);
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);

    const [count] = args;
    const countArticle = Number.parseInt(count, 10) || DEFAULT_COUNT;
    if (countArticle > 1000) {
      console.info(chalk.red(`Не больше 1000 публикаций.`));
      process.exit(ExitCode.ERROR);
    }

    const articles = generateArticles(countArticle, categories, sentences, titles, comments);
    const content = JSON.stringify(articles);
    try {
      await fs.writeFile(FILE_MOCKS_NAME, content);
      console.info(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
    }
  }
};
