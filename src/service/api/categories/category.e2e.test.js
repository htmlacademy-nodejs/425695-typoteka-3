'use strict';
const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../../lib/init-db`);
const {HttpCode} = require(`../../constants`);
const categories = require(`./categories`);
const DataService = require(`../../data-service/category`);
const {mockArticles, mockCategories, mockUsers} = require(`./mockData`);


const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});

const app = express();
app.use(express.json());

beforeAll(async () => {
  await initDB(mockDB, {categories: mockCategories, articles: mockArticles, users: mockUsers});
  categories(app, new DataService(mockDB));
});

describe(`API returns category list`, () => {

  test(`Status code 200`, async () => {
    const response = await request(app).get(`/categories`);

    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`Returns list of 5 categories`, async () => {
    const response = await request(app).get(`/categories`);

    expect(response.body.length).toBe(5);
  });

  test(`Category names are "Разное", "Без рамки", "Музыка", "IT", "За жизнь", "Деревья", "Железо", "Кино"`, async () => {
    const response = await request(app).get(`/categories`);

    expect(response.body.map((it) => it.name)).toEqual(
        expect.arrayContaining([`Разное`, `Без рамки`, `Музыка`, `IT`, `За жизнь`]));
  });
});
