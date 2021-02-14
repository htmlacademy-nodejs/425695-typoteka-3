'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {
  ANNOUNCE_MAX_COUNT,
  CATEGORIES,
  CreatedDateMs,
  DEFAULT_COUNT,
  ExitCode,
  FILE_NAME,
  FULLTEXT_MAX_COUNT,
  SENTENCES,
  TITLES,
} = require(`../constants`);
const {
  getRandomInt,
  shuffle,
} = require(`../utils`);

const getCategories = (categoriesLength) => {
  return Array.from(new Set(Array(categoriesLength)
  .fill(``)
  .map(() => CATEGORIES[getRandomInt(0, categoriesLength - 1)])));
};

const generateOffers = (count) => (
  Array(count).fill({}).map(() => ({
    announce: shuffle(SENTENCES).slice(1, ANNOUNCE_MAX_COUNT).join(` `),
    сategory: getCategories(getRandomInt(1, CATEGORIES.length)),
    createdDate: new Date(getRandomInt(CreatedDateMs.MIN, CreatedDateMs.MAX)),
    title: TITLES[getRandomInt(0, TITLES.length - 1)],
    fullText: shuffle(SENTENCES).slice(1, FULLTEXT_MAX_COUNT).join(` `),
  }))
);

module.exports = {
  name: `--generate`,
  async run(args) {
    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    if (countOffer > 1000) {
      console.info(chalk.red(`Не больше 1000 объявлений.`));
      process.exit(ExitCode.ERROR);
    }
    const content = JSON.stringify(generateOffers(countOffer));
    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
    }
  }
};
