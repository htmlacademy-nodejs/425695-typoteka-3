'use strict';

const fs = require(`fs`);
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
    // category: getCategories(getRandomInt(1, CATEGORIES.length)),
    // description: shuffle(SENTENCES).slice(1, 5).join(` `),
    // picture: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
    // title: TITLES[getRandomInt(0, TITLES.length - 1)],
    // type: Object.values(OfferType)[Math.floor(Math.random() * Object.keys(OfferType).length)],
    // sum: getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
  }))
);

module.exports = {
  name: `--generate`,
  run(args) {
    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    if (countOffer > 1000) {
      console.info(`Не больше 1000 объявлений.`);
      process.exit(ExitCode.ERROR);
    }
    const content = JSON.stringify(generateOffers(countOffer));
    fs.writeFile(FILE_NAME, content, (err) => {
      if (err) {
        return console.error(`Can't write data to file...`);
      }

      return console.info(`Operation success. File created.`);
    });
  }
};
