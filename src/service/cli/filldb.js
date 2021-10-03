'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
// const {nanoid} = require(`nanoid`);
const {getLogger} = require(`../lib`);
const sequelize = require(`../lib/sequelize`);
const initDatabase = require(`../lib/init-db`);

const {
  ANNOUNCE_MAX_COUNT,
  FULLTEXT_MAX_COUNT,
  // CreatedDateMs,
  DEFAULT_COUNT,
  // ExitCode,
  FILE_CATEGORIES_PATH,
  FILE_COMMENTS_PATH,
  // FILE_MOCKS_NAME,
  FILE_SENTENCES_PATH,
  FILE_PICTURES_PATH,
  FILE_TITLES_PATH,
  MAX_COMMENTS,
  // MAX_ID_LENGTH,
} = require(`../constants`);
const {
  getRandomInt,
  shuffle,
} = require(`../utils`);

const logger = getLogger({name: `filldb`});

// const getCategories = (categories) => {
//   const categoriesLength = getRandomInt(1, categories.length - 1);
//   return Array.from(new Set(Array(categoriesLength)
//   .fill(``)
//   .map(() => categories[getRandomInt(0, categoriesLength)])));
// };

const generateComments = (count, comments, users) => (
  Array(count).fill({}).map(() => ({
    user: users[getRandomInt(0, users.length - 1)].email,
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `)
  }))
);
// const generateComments = (article, count, comments) => (
//   Array(count).fill({}).map(() => ({
//     article,
//     createdDate: new Date(),
//     id: nanoid(MAX_ID_LENGTH),
//     text: shuffle(comments)
//       .slice(0, getRandomInt(1, 3))
//       .join(` `),
//   }))
// );
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
    // const articleBase = {
    //   id: nanoid(MAX_ID_LENGTH),
    //   title: titles[getRandomInt(0, titles.length - 1)],
    // };
    return {
      // ...articleBase,
      announce: shuffle(sentences).slice(1, ANNOUNCE_MAX_COUNT).join(` `),
      fullText: shuffle(sentences).slice(1, FULLTEXT_MAX_COUNT).join(` `),
      picture: pictures[getRandomInt(1, pictures.length - 1)],
      user: users[getRandomInt(0, users.length - 1)].email,
      categories: getRandomSubarray(categories),
      comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments, users),
      // picture: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
      title: titles[getRandomInt(0, titles.length - 1)],
    };
  })
);

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);

    return content.split(`\n`).filter(Boolean);
  } catch (err) {
    logger.error(chalk.red(err));
    return [];
  }
};

module.exports = {
  name: `--filldb`,
  async run(args) {
    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occured: ${err.message}`);
      process.exit(1);
    }
    logger.info(`Connection to database established`);

    const categories = await readContent(FILE_CATEGORIES_PATH);
    const comments = await readContent(FILE_COMMENTS_PATH);
    const pictures = await readContent(FILE_PICTURES_PATH);
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const users = [
      {
        name: `Иван Иванов`,
        email: `ivanov@example.com`,
        // passwordHash: await passwordUtils.hash(`ivanov`),
        avatar: `avatar01.jpg`
      },
      {
        name: `Пётр Петров`,
        email: `petrov@example.com`,
        // passwordHash: await passwordUtils.hash(`petrov`),
        avatar: `avatar02.jpg`
      }
    ];

    const [count] = args;
    // const countArticle = Number.parseInt(count, 10) || DEFAULT_COUNT;
    // if (countArticle > 1000) {
    //   logger.info(chalk.red(`Не больше 1000 публикаций.`));
    //   process.exit(ExitCode.ERROR);
    // }

    // const articles = generateArticles(countArticle, categories, sentences, titles, comments, pictures);
    // const content = JSON.stringify(articles);
    // try {
    //   await fs.writeFile(FILE_MOCKS_NAME, content);
    //   logger.info(chalk.green(`Operation success. File created.`));
    // } catch (err) {
    //   logger.error(chalk.red(`Can't write data to file...`));
    // }


    const countArticle = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const articles = generateArticles(countArticle, titles, categories, sentences, comments, pictures, users);

    return initDatabase(sequelize, {articles, categories, users});
  }
};
