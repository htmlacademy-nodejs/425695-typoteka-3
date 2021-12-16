'use strict';

const Joi = require('joi');

const {HttpCode} = require('../constants');

const ErrorCommentMessage = {
  TEXT_MIN: 'Комментарий содержит меньше 20 символов',
  TEXT_MAX: 'Комментарий содержит более 255 символов',
  USER_ID: 'Некорректный идентификатор пользователя'
};

const schema = Joi.object({
  text: Joi.string().min(20).max(255).required().messages({
    'string.empty': ErrorCommentMessage.TEXT_MIN,
    'string.min': ErrorCommentMessage.TEXT_MIN,
    'string.max': ErrorCommentMessage.TEXT_MAX
  }),
  userId: Joi.number().integer().positive().required().messages({
    'number.base': ErrorCommentMessage.USER_ID
  })
});
module.exports = (req, res, next) => {
  const comment = req.body;

  const {error} = schema.validate(comment, {abortEarly: false});
  if (error) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join('\n'));
  }

  return next();
};
