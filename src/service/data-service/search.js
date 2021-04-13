'use strict';

class SearchService {
  constructor(articles) {
    this._articles = articles;
  }

  findArticles(searchText) {
    const foundArticles = this._articles.filter((item) => item.title.toLowerCase().includes(searchText.toLowerCase()));

    return [...foundArticles];
  }
}

module.exports = SearchService;
