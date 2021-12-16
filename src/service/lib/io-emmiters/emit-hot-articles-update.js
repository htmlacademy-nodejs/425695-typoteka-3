'use strict';
const {SocketAction} = require('../../constants');

module.exports = async ({io, articleId, articleService}) => {
  const isInHotArticles = await articleService.isInHot(articleId);

  if (isInHotArticles) {
    const hotArticles = await articleService.findHot();
    io.emit(SocketAction.UPDATE_HOT_ARTICLES, hotArticles);
  }
};
