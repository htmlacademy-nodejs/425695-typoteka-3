'use strict';

const {Model} = require('sequelize');

const defineArticle = require('./article');
const defineCategory = require('./category');
const defineComment = require('./comment');
const defineUser = require('./user');
const Aliase = require('./aliase');

const define = (sequelize) => {
  const Article = defineArticle(sequelize);
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const User = defineUser(sequelize);

  Article.hasMany(Comment, {as: Aliase.COMMENTS, foreignKey: 'articleId', onDelete: 'cascade'});
  Comment.belongsTo(Article, {foreignKey: 'articleId'});

  class ArticleCategory extends Model {}
  ArticleCategory.init({}, {sequelize});

  Article.belongsToMany(Category, {through: ArticleCategory, as: Aliase.CATEGORIES});
  Category.belongsToMany(Article, {through: ArticleCategory, as: Aliase.ARTICLES});
  Category.hasMany(ArticleCategory, {as: Aliase.ARTICLE_CATEGORIES});

  Article.hasMany(ArticleCategory, {as: Aliase.ARTICLE_CATEGORIES});


  User.hasMany(Article, {as: Aliase.ARTICLES, foreignKey: 'userId', onDelete: 'cascade'});
  Article.belongsTo(User, {as: Aliase.USERS, foreignKey: 'userId'});

  User.hasMany(Comment, {as: Aliase.COMMENTS, foreignKey: 'userId', onDelete: 'cascade'});
  Comment.belongsTo(User, {as: Aliase.USERS, foreignKey: 'userId'});


  return {Article, ArticleCategory, Category, Comment, User};
};

module.exports = define;
