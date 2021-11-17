'use strict';

const Aliase = require('../models/aliase');

class CommentService {
  constructor(sequelize) {
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

  findAll(articleId) {
    return this._Comment.findAll({
      include: [
        {
          model: this._User,
          as: Aliase.USER,
          attributes: {
            exclude: ['passwordHash']
          }
        }
      ],
      where: {articleId},
      raw: true
    });
  }

}

module.exports = CommentService;
