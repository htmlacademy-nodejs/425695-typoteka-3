'use strict';

const Aliase = require('../models/aliase');
const truncate = require('../lib/truncate');
const UserRelatedService = require('./user-related');

class ArticleService extends UserRelatedService {
  constructor(sequelize) {
    super(sequelize);
    this._sequelize = sequelize;
    this._Article = sequelize.models.Article;
    this._ArticleCategory = sequelize.models.ArticleCategory;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
    this._User = sequelize.models.User;

    this._commentInclusion = {
      model: this._Comment,
      as: Aliase.COMMENTS,
      include: [this._userInclusion]
    };
  }

  _getInclude(comments, countCategories = false) {
    const include = [
      {
        model: this._Category,
        as: Aliase.CATEGORIES,
        attributes: [
          'id',
          'name'
        ]
      },
      this._userInclusion
    ];

    if (countCategories) {
      include[0].attributes.push([
        this._sequelize.fn('COUNT', this._sequelize.col('Article.id')),
        'count'
      ]);
      include[0].include = [{
        model: this._ArticleCategory,
        as: Aliase.ARTICLE_CATEGORIES,
        attributes: []
      }];
    }

    if (comments) {
      include.push(this._commentInclusion);
    }

    return include;
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

  async findAll(needComments, userId = null) {
    const options = {
      include: [Aliase.CATEGORIES,
        {
          model: this._User,
          as: Aliase.USERS,
          attributes: {
            exclude: ['passwordHash']
          }
        }],
      order: [
        ['createdAt', 'DESC']
      ]
    };
    if (needComments) {
      options.include.push({
        model: this._Comment,
        as: Aliase.COMMENTS,
        include: [
          {
            model: this._User,
            as: Aliase.USERS,
            attributes: {
              exclude: ['passwordHash']
            }
          }
        ]
      });
    }

    if (userId) {
      options.where = {
        userId
      };
    }


    const articles = await this._Article.findAll(options);

    return articles.map((item) => item.get());
  }

  async findOne(id, needComments) {
    const options = {
      subQuery: false,
      include: this._getInclude(needComments, true),
      group: [
        this._sequelize.col('Article.id'),
        this._sequelize.col('Categories.id'),
        this._sequelize.col('Categories->ArticleCategory.createdAt'),
        this._sequelize.col('Categories->ArticleCategory.updatedAt'),
        this._sequelize.col('Categories->ArticleCategory.ArticleId'),
        this._sequelize.col('Categories->ArticleCategory.CategoryId'),
        this._sequelize.col('Users.id')
      ],
      order: [[{model: this._Category, as: Aliase.CATEGORIES}, 'name', 'asc']]
    };

    if (needComments) {
      options.group.push(this._sequelize.col('Comments.id'), this._sequelize.col('Comments->Users.id'));
      options.order.push([{model: this._Comment, as: Aliase.COMMENTS}, 'createdAt', 'desc']);
    }

    const article = await this._Article.findByPk(id, options);
    if (article) {
      return article.get({plain: true});
    }
    return article;
  }

  async findHot() {
    const options = {
      subQuery: false,
      attributes: {
        include: [
          [this._sequelize.fn('COUNT', this._sequelize.col('Comments.id')), 'commentsCount']
        ]
      },
      include: [{
        model: this._Comment,
        as: Aliase.COMMENTS,
        attributes: []
      }],
      group: [
        this._sequelize.col('Article.id')
      ],
      order: [
        [this._sequelize.fn('COUNT', this._sequelize.col('Comments.id')), 'desc']
      ],
      limit: 4
    };

    const articles = await this._Article.findAll(options);

    return articles
      .map((item) => {
        const article = item.get();
        article.truncatedText = truncate(article.announce);

        return article;
      })
      .filter((item) => item.commentsCount);
  }

  async update(id, articleData) {
    const [affectedRows] = await this._Article.update(articleData, {
      where: {id}
    });

    const article = await this._Article.findByPk(id);
    await article.setCategories(articleData.categories);

    return Boolean(affectedRows);
  }

  async findPage({categoryId, comments, limit, offset}) {
    const options = {
      limit,
      offset,
      include: this._getInclude(comments),
      distinct: true,
      order: [
        ['createdAt', 'desc'],
        [{model: this._Category, as: Aliase.CATEGORIES}, 'name', 'asc']
      ]
    };
    if (categoryId) {
      options.include.push({
        model: this._ArticleCategory,
        as: Aliase.ARTICLE_CATEGORIES,
        attributes: [],
        where: {
          CategoryId: categoryId
        }
      });
    }

    const {count, rows} = await this._Article.findAndCountAll(options);
    return {count, articles: rows};
  }

}

module.exports = ArticleService;
