'use strict';
const express = require(`express`);
const request = require(`supertest`);

const {HttpCode} = require(`../../constants`);
const categories = require(`./categories`);
const DataService = require(`../../data-service/category`);
const {mockData} = require(`./mockData`);


const createAPI = () => {
  const app = express();
  app.use(express.json());
  categories(app, new DataService(mockData));
  return app;
};

describe(`API returns category list`, () => {

  test(`Status code 200`, async () => {
    const app = createAPI();
    const response = await request(app).get(`/categories`);

    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`Returns list of 8 categories`, async () => {
    const app = createAPI();
    const response = await request(app).get(`/categories`);

    expect(response.body.length).toBe(8);
  });

  test(`Category names are "Разное", "Без рамки", "Музыка", "IT", "За жизнь", "Деревья", "Железо", "Кино"`, async () => {
    const app = createAPI();
    const response = await request(app).get(`/categories`);

    expect(response.body).toEqual(
        expect.arrayContaining([`Разное`, `Без рамки`, `Музыка`, `IT`, `За жизнь`, `Деревья`, `Железо`, `Кино`]));
  });
});
