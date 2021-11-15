'use strict';

const Aliase = require('../models/aliase');

class ArticleService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
    this._User = sequelize.models.User;
  }

  async create(articleData) {
    const article = await this._Article.create(articleData);
    await article.addCategories(articleData.categories);
    return article.get();
  }

  async drop(id) {
    const deletedRows = await this._Article.destroy({
      where: {id}
    });
    return !!deletedRows;
  }

  async findAll(needComments) {
    const include = [Aliase.CATEGORIES,
      {
        model: this._User,
        as: Aliase.USER,
        attributes: {
          exclude: ['passwordHash']
        }
      }];
    if (needComments) {
      include.push({
        model: this._Comment,
        as: Aliase.COMMENTS,
        include: [
          {
            model: this._User,
            as: Aliase.USER,
            attributes: {
              exclude: ['passwordHash']
            }
          }
        ]
      });
    }

    const articles = await this._Article.findAll({
      include,
      order: [
        ['createdAt', 'DESC']
      ]
    });

    return articles.map((item) => item.get());
  }

  async findOne(id, needComments) {
    const include = [Aliase.CATEGORIES,
      {
        model: this._User,
        as: Aliase.USER,
        attributes: {
          exclude: ['passwordHash']
        }
      }];

    if (needComments) {
      include.push({
        model: this._Comment,
        as: Aliase.COMMENTS,
        include: [
          {
            model: this._User,
            as: Aliase.USER,
            attributes: {
              exclude: ['passwordHash']
            }
          }
        ]
      });
    }
    return await this._Article.findByPk(id, {include});
  }

  async update(id, article) {
    const [affectedRows] = await this._Article.update(article, {
      where: {id}
    });
    return !!affectedRows;
  }

  async findPage({comments, limit, offset}) {
    const include = [Aliase.CATEGORIES];

    if (comments) {
      include.push(Aliase.COMMENTS);
    }
    const {count, rows} = await this._Article.findAndCountAll({
      limit,
      offset,
      include,
      order: [
        ['createdAt', 'DESC']
      ],
      distinct: true
    });

    return {count, articles: rows};
  }

}

module.exports = ArticleService;
