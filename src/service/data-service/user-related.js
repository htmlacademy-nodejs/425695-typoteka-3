'use strict';

const Aliase = require('../models/aliase');

class UserRelatedService {
  constructor({models}) {
    this._User = models.User;
  }

  get _userInclusion() {
    return {
      model: this._User,
      as: Aliase.USERS,
      attributes: {
        exclude: ['passwordHash']
      }
    };
  }
}

module.exports = UserRelatedService;
