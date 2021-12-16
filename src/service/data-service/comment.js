'use strict';

const Aliase = require('../models/aliase');
const truncate = require('../lib/truncate');
const UserRelatedService = require('./user-related');

class CommentService extends UserRelatedService {
  constructor(sequelize) {
    super(sequelize);
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._User = sequelize.models.User;
  }

  async create(articleId, comment) {
    return await this._Comment.create({
      articleId,
      ...comment
    });
  }

  async drop(id) {
    const deletedRows = await this._Comment.destroy({
      where: {id}
    });
    return !!deletedRows;
  }

  async findOne(id) {
    const comment = await this._Comment.findByPk(id);
    if (comment) {
      return comment.get({plain: true});
    }
    return comment;
  }

  async findAll({articleId = null, limit = null, userId = null} = {}) {
    const options = {
      include: [this._userInclusion],
      order: [['createdAt', 'desc']]
    };

    if (articleId) {
      options.where = {ArticleId: articleId};
    }

    if (userId) {
      options.include.push({
        model: this._User,
        as: Aliase.USERS,
        attributes: ['avatar', 'name']
      });
      options.where = {userId};
    }

    if (limit) {
      options.limit = limit;
    } else {
      options.include.push({
        model: this._Article,
        as: Aliase.ARTICLES,
        attributes: ['title']
      });
    }

    return await this._Comment.findAll(options);
  }

  async findLast() {
    const comments = await this.findAll({limit: 4});
    return comments.map((item) => {
      const comment = item.get();
      comment.truncatedText = truncate(comment.text);
      return comment;
    });
  }

}

module.exports = CommentService;
