'use strict';

const axios = require('axios');

const {HttpMethod} = require('./constants');

const TIMEOUT = 1000;
class API {

  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout
    });
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

  async dropComment(id) {
    return this._load(`/comments/${id}`, {
      method: HttpMethod.DELETE
    });
  }

  async getArticle(id, {comments}) {
    return this._load(`/articles/${id}`, {params: {comments}});
  }

  async getArticles({categoryId, isHot, offset, limit, comments, userId}) {
    return this._load('/articles', {params: {categoryId, isHot, offset, limit, comments, userId}});
  }

  async getCategories({count}) {
    return this._load('/categories', {params: {count}});
  }

  async getComments({isLast, limit, userId} = {}) {
    return this._load('/comments', {params: {isLast, limit, userId}});
  }

  async search(query) {
    return this._load('/search', {params: {query}});
  }

  async _load(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }
}


const port = process.env.API_PORT || 3000;
const defaultUrl = `http://localhost:${port}/api/`;

const defaultAPI = new API(defaultUrl, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};
