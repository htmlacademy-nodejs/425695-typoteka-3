'use strict';

const DEFAULT_SERVER_PORT = 3000;
const ARTICLES_PER_PAGE = 8;
const LAST_COMMENTS_LIMIT = 4;
const SocketAction = {
  ADD_LAST_COMMENT: 'lastComment:add',
  UPDATE_HOT_ARTICLES: 'hotArticles:update',
  UPDATE_LAST_COMMENTS: 'lastComments:update',
};

(() => {
  const SERVER_URL = `http://localhost:${DEFAULT_SERVER_PORT}`;
  const socket = io(SERVER_URL);

  const createHotArticleElement = (article) => {
    const hotArticleTemplate = document.querySelector(`#template-article-hot`);
    const hotArticleElement = hotArticleTemplate.cloneNode(true).content;
    const hotArticleLink = hotArticleElement.querySelector(`.hot__list-link`);
    const hotArticleSup = hotArticleElement.querySelector(`.hot__link-sup`);

    hotArticleLink.href = `/articles/${article.id}`;
    hotArticleLink.textContent = `${article.truncatedText}`
    hotArticleSup.textContent = `${article.commentsCount}`
    hotArticleLink.append(hotArticleSup)

    return hotArticleElement;
  };

  const createLastCommentElement = (comment) => {
    const lastCommentTemplate = document.querySelector(`#template-comment-last`);
    const lastCommentElement = lastCommentTemplate.cloneNode(true).content;

    lastCommentElement.querySelector(`.last__list-image`).src = `/img/${comment.Users.avatar}`;
    lastCommentElement.querySelector(`.last__list-name`).textContent = `${comment.Users.name}`
    lastCommentElement.querySelector(`.last__list-link`).href = `/articles/${comment.articleId}`;
    lastCommentElement.querySelector(`.last__list-link`).textContent = `${comment.truncatedText}`;

    return lastCommentElement;
  };

  const addLastComment = (comment) => {
    const lastCommentsList = document.querySelector(`.last__list`);
    const lastComments = lastCommentsList.querySelectorAll(`.last__list-item`);

    if (lastComments.length === LAST_COMMENTS_LIMIT) {
      lastComments[lastComments.length - 1].remove();
    }

    lastCommentsList.prepend(createLastCommentElement(comment));
  };

  const updateHotArticles = (articles) => {
    const hotArticlesList = document.querySelector(`.hot__list`);
    const hotArticles = hotArticlesList.querySelectorAll(`.hot__list-item`);
    for (let _i = 0; _i < hotArticles.length; _i++) {
      hotArticles[_i].remove();
    }
    articles.forEach((_article) => {
      hotArticlesList.append(createHotArticleElement(_article));
    });
  };

  const updateLastComments = (comments) => {
    const lastCommentsList = document.querySelector(`.last__list`);
    const lastComments = lastCommentsList.querySelectorAll(`.last__list-item`);
    for (let _i = 0; _i < lastComments.length; _i++) {
      lastComments[_i].remove();
    }
    comments.forEach((_comment) => {
      lastCommentsList.append(createLastCommentElement(_comment));
    });
  };

  socket.addEventListener(SocketAction.ADD_LAST_COMMENT, addLastComment);
  socket.addEventListener(SocketAction.UPDATE_HOT_ARTICLES, updateHotArticles);
  socket.addEventListener(SocketAction.UPDATE_LAST_COMMENTS, updateLastComments);
})();
