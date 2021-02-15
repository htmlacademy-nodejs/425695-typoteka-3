'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {
  ANNOUNCE_MAX_COUNT,
  CreatedDateMs,
  DEFAULT_COUNT,
  ExitCode,
  FILE_CATEGORIES_PATH,
  FILE_NAME,
  FILE_SENTENCES_PATH,
  FILE_TITLES_PATH,
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

const generateOffers = (count, categories, sentences, titles) => (
  Array(count).fill({}).map(() => ({
    announce: shuffle(sentences).slice(1, ANNOUNCE_MAX_COUNT).join(` `),
    сategory: getCategories(categories),
    createdDate: new Date(getRandomInt(CreatedDateMs.MIN, CreatedDateMs.MAX)),
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
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);

    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    if (countOffer > 1000) {
      console.info(chalk.red(`Не больше 1000 объявлений.`));
      process.exit(ExitCode.ERROR);
    }

    const offers = generateOffers(countOffer, categories, sentences, titles);
    const content = JSON.stringify(offers);
    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
    }
  }
};
