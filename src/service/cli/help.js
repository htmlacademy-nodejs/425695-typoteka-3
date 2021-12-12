'use strict';

const chalk = require('chalk');

module.exports = {
  name: '--help',
  run() {
    const text = `
    Программа запускает http-сервер и заполняет локальную БД для API.

    Гайд:
    npm run service -- <command>
    Команды:
    --filldb <COUNT>       заполняет локальную БД (COUNT - количество постов)
    --server <PORT>        запускает http-сервер (PORT - номер порта)
    --version              выводит номер версии
    --help                 печатает этот текст
    `;
    console.log(chalk.gray(text));
  }
};
