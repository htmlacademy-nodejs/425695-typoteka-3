'use strict';
const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../../lib/init-db`);
const {HttpCode} = require(`../../constants`);
const search = require(`./search`);
const DataService = require(`../../data-service/search`);
const {mockArticles, mockCategories, mockUsers} = require(`./mockData`);

const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});


const app = express();
app.use(express.json());

beforeAll(async () => {
  await initDB(mockDB, {categories: mockCategories, articles: mockArticles, users: mockUsers});
  search(app, new DataService(mockDB));
});

describe(`API returns article based on search query`, () => {

  test(`Status code 200`, async () => {
    const response = await request(app)
      .get(`/search`)
      .query({query: `Что такое золотое сечение`});

    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`1 article found`, async () => {
    const response = await request(app)
      .get(`/search`)
      .query({query: `Что такое золотое сечение`});

    expect(response.body.length).toBe(1);
  });

  test(`Article has correct title`, async () => {
    const response = await request(app)
      .get(`/search`)
      .query({query: `Что такое золотое сечение.`});

    expect(response.body[0].title).toBe(`Что такое золотое сечение.`);
  });
});

test(`API returns code 404 if nothing is found`, async () => {
  await request(app)
      .get(`/search`)
      .query({
        query: `Продам свою душу`
      })
      .expect(HttpCode.NOT_FOUND);
});

test(`API returns 400 when query string is absent`, async () => {
  await request(app)
      .get(`/search`)
      .expect(HttpCode.BAD_REQUEST);
});
