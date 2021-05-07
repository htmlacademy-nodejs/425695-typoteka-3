'use strict';
const express = require(`express`);
const request = require(`supertest`);

const {HttpCode} = require(`../../constants`);
const search = require(`./search`);
const DataService = require(`../../data-service/search`);
const {mockData} = require(`./mockData`);

const createAPI = () => {
  const app = express();
  app.use(express.json());
  search(app, new DataService(mockData));
  return app;
};

describe(`API returns article based on search query`, () => {

  test(`Status code 200`, async () => {
    const app = createAPI();
    const response = await request(app)
      .get(`/search`)
      .query({query: `Что такое золотое сечение`});

    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`1 article found`, async () => {
    const app = createAPI();
    const response = await request(app)
      .get(`/search`)
      .query({query: `Что такое золотое сечение`});

    expect(response.body.length).toBe(1);
  });

  test(`Article has correct id`, async () => {
    const app = createAPI();
    const response = await request(app)
      .get(`/search`)
      .query({query: `Что такое золотое сечение`});

    expect(response.body[0].id).toBe(`0Xfnhn`);
  });
});

test(`API returns code 404 if nothing is found`, async () => {
  const app = createAPI();

  await request(app)
      .get(`/search`)
      .query({
        query: `Продам свою душу`
      })
      .expect(HttpCode.NOT_FOUND);
});

test(`API returns 400 when query string is absent`, async () => {
  const app = createAPI();

  await request(app)
      .get(`/search`)
      .expect(HttpCode.BAD_REQUEST);
});
