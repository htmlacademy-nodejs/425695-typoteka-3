'use strict';

const axios = require(`axios`);

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

  async createArticle(data) {
    return this._load(`/articles`, {
      method: `POST`,
      data
    });
  }

  getArticle(id, {comments}) {
    return this._load(`/articles/${id}`, {params: {comments}});
  }

  getArticles({offset, limit, comments}) {
    return this._load(`/articles`, {params: {offset, limit, comments}});
  }

  getCategories(count) {
    return this._load(`/categories`, {params: {count}});
  }

  search(query) {
    return this._load(`/search`, {params: {query}});
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
