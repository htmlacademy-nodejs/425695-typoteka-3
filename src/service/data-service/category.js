'use strict';

const Aliase = require('../models/aliase');

class CategoryService {
  constructor(sequelize) {
    this._sequelize = sequelize;
    this._Category = sequelize.models.Category;
    this._ArticleCategory = sequelize.models.ArticleCategory;
  }

  async findOne(id) {
    const category = await this._Category.findByPk(id);
    if (category) {
      return category.get({plain: true});
    }
    return category;
  }

  async findAll(needCount) {
    if (needCount) {
      const result = await this._Category.findAll({
        attributes: [
          'id',
          'name',
          [this._sequelize.fn('COUNT', this._sequelize.col('ArticleCategories.CategoryId')), 'count']
        ],
        group: [this._sequelize.col('Category.id')],
        include: [{
          model: this._ArticleCategory,
          as: Aliase.ARTICLE_CATEGORIES,
          attributes: []
        }],
      });

      return result.map((it) => ({...it.get(), count: +it.get().count}));
    } else {
      return this._Category.findAll({raw: true});
    }
  }

  async create(data) {
    await this._Category.create(data);
  }

  async update(id, data) {
    const [affectedRows] = await this._Category.update(data, {
      where: {id}
    });

    return Boolean(affectedRows);
  }

  async drop(id) {
    const deletedRows = await this._Category.destroy({
      where: {id}
    });
    return !!deletedRows;
  }
}

module.exports = CategoryService;
