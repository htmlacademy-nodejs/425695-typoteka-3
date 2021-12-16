'use strict';

const DEFAULT_SERVER_PORT = 3000;
const ARTICLES_PER_PAGE = 8;
const LAST_COMMENTS_LIMIT = 4;
const SocketAction = {
  CREATE_ARTICLE: 'article:create',
  ADD_IN_LAST_COMMENT: 'inLastComment:add',
  UPDATE_IN_LAST_COMMENTS: 'inLastComments:update',
};

(() => {
  const SERVER_URL = `http://localhost:${DEFAULT_SERVER_PORT}`;
  const socket = io(SERVER_URL);

  // const updateHotArticles = (article) => {
  //   const previewListElement = document.querySelector(`.preview__list`);
  //   const previewItems = [...previewListElement.querySelectorAll(`.preview__item`)];
  //   const newPreviewItem = createArticleElement(article);

  //   for (const previewItem of previewItems) {
  //     const timeElement = previewItem.querySelector(`time`);

  //     if (timeElement.dateTime <= article.createdAt) {
  //       previewListElement.insertBefore(newPreviewItem, previewItem);

  //       if (previewItems.length === ARTICLES_PER_PAGE) {
  //         previewItems[previewItems.length - 1].remove();
  //       }
  //       return;
  //     }
  //   }
  // };

  const createLastCommentElement = (comment) => {
    const commentTemplate = document.querySelector(`#template-comment-last`);
    const commentElement = commentTemplate.cloneNode(true).content;

    commentElement.querySelector(`.last__list-image`).src = `/img/${comment.Users.avatar}`;
    commentElement.querySelector(`.last__list-name`).textContent = `${comment.Users.name}`
    commentElement.querySelector(`.last__list-link`).href = `/articles/${comment.articleId}`;
    commentElement.querySelector(`.last__list-link`).textContent = `${comment.truncatedText}`;

    return commentElement;
  };

  const addLastComment = (comment) => {
    const lastCommentsList = document.querySelector(`.last__list`);
    const lastComments = lastCommentsList.querySelectorAll(`.last__list-item`);

    if (lastComments.length === LAST_COMMENTS_LIMIT) {
      lastComments[lastComments.length - 1].remove();
    }

    lastCommentsList.prepend(createLastCommentElement(comment));
  };

  const updateLastComments = (comments) => {
    const lastCommentsList = document.querySelector(`.last__list`);
    while (lastCommentsList.lastElementChild) {
      lastCommentsList.removeChild(lastCommentsList.lastElementChild);
    }
    comments.forEach((_comment) => {
    lastCommentsList.append(createLastCommentElement(_comment));

    });
  };

  // socket.addEventListener(SocketAction.CREATE_ARTICLE, (article) => {
  //   updateHotArticles(article);
  // });

  socket.addEventListener(SocketAction.ADD_IN_LAST_COMMENT, addLastComment);
  socket.addEventListener(SocketAction.UPDATE_IN_LAST_COMMENTS, updateLastComments);
})();
