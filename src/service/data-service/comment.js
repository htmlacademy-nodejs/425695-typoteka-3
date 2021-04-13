'use strict';

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../constants`);

class CommentService {
  constructor(articles) {
    this._articles = articles;
  }

  create(articleId, commentText) {
    const article = this._articles.find((item) => item.id === articleId);

    if (!article) {
      return null;
    }

    const comment = {id: nanoid(MAX_ID_LENGTH), text: commentText};

    Object.assign(article, {...article, comments: [...article.comments, comment]});

    return comment;
  }

  drop(articleId, commentId) {
    const article = this._articles.find((item) => item.id === articleId);

    if (!article) {
      return {article: null, comment: null};
    }

    const comment = article.comments.find((item) => item.id === commentId);

    if (!comment) {
      return {article, comment: null};
    }

    Object.assign(article, {...article, comments: article.comments.filter((item) => item.id !== commentId)});

    return {article, comment};
  }

}

module.exports = CommentService;
