'use strict';

const axios = require('axios');

const {HttpMethod} = require('./constants');

class API {

  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout
    });
  }

  async _load(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }

  async createUser(data) {
    return this._load('/user', {
      method: HttpMethod.POST,
      data
    });
  }

  async auth(email, password) {
    return this._load('/user/auth', {
      method: HttpMethod.POST,
      data: {email, password}
    });
  }

  async createArticle(data) {
    return this._load('/articles', {
      method: HttpMethod.POST,
      data
    });
  }

  async editArticle(id, data) {
    return this._load(`/articles/${id}`, {
      method: HttpMethod.PUT,
      data
    });
  }
  async createCategory(data) {
    return this._load('/categories', {
      method: HttpMethod.POST,
      data
    });
  }
  async editCategory(id, data) {
    return this._load(`/categories/${id}`, {
      method: HttpMethod.PUT,
      data
    });
  }
  async dropCategory(id) {
    return this._load(`/categories/${id}`, {
      method: HttpMethod.DELETE
    });
  }
  async dropArticle(id) {
    return this._load(`/articles/${id}`, {
      method: HttpMethod.DELETE
    });
  }

  async createComment(id, data) {
    return this._load(`/articles/${id}/comments`, {
      method: HttpMethod.POST,
      data
    });
  }

  getArticle(id, {comments}) {
    return this._load(`/articles/${id}`, {params: {comments}});
  }

  getArticles({categoryId, isHot, offset, limit, comments, userId}) {
    return this._load('/articles', {params: {categoryId, isHot, offset, limit, comments, userId}});
  }

  getCategories({count}) {
    return this._load('/categories', {params: {count}});
  }

  getComments({isLast, limit} = {}) {
    return this._load('/comments', {params: {isLast, limit}});
  }

  search(query) {
    return this._load('/search', {params: {query}});
  }
}

const TIMEOUT = 1000;

const port = process.env.API_PORT || 3000;
const defaultUrl = `http://localhost:${port}/api/`;

const defaultAPI = new API(defaultUrl, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};
