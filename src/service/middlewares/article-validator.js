'use strict';
const Joi = require('joi');

const {HttpCode} = require('../constants');

const ErrorArticleMessage = {
  CATEGORIES: 'Не выбрана ни одна категория статьи',
  TITLE_EMPTY: 'Заголовок отсутствует',
  TITLE_MIN: 'Заголовок содержит меньше 30 символов',
  TITLE_MAX: 'Заголовок не может содержать более 250 символов',
  ANNOUNCE_EMPTY: 'Анонс отсутствует',
  ANNOUNCE_MIN: 'Анонс содержит меньше 30 символов',
  ANNOUNCE_MAX: 'Анонс не может содержать более 250 символов',
  FULL_TEXT_EMPTY: 'Описание отсутствует',
  FULL_TEXT_MAX: 'Описание не может содержать более 1000 символов',
  PICTURE: 'Изображение не выбрано или тип изображения не поддерживается',
};

const schema = Joi.object({
  categories: Joi.array().items(
      Joi.number().integer().positive().messages({
        'number.base': ErrorArticleMessage.CATEGORIES
      })
  ).min(1).required(),
  title: Joi.string().min(30).max(250).required().messages({
    'string.empty': ErrorArticleMessage.TITLE_EMPTY,
    'string.min': ErrorArticleMessage.TITLE_MIN,
    'string.max': ErrorArticleMessage.TITLE_MAX
  }),
  announce: Joi.string().min(30).max(250).required().messages({
    'string.empty': ErrorArticleMessage.ANNOUNCE_EMPTY,
    'string.min': ErrorArticleMessage.ANNOUNCE_MIN,
    'string.max': ErrorArticleMessage.ANNOUNCE_MAX
  }),
  fullText: Joi.string().max(1000).allow('').messages({
    'string.max': ErrorArticleMessage.FULL_TEXT_MAX
  }),
  picture: Joi.string().allow(null, ''),
  publishedAt: Joi.date().required(),
  userId: Joi.number().integer().positive().required()
});

module.exports = (req, res, next) => {
  const newArticle = req.body;
  const {error} = schema.validate(newArticle, {abortEarly: false});

  if (error) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join('\n'));
  }

  return next();
};
