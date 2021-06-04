'use strict';
const express = require(`express`);
const request = require(`supertest`);

const {HttpCode} = require(`../../constants`);
const comments = require(`./comments`);
const DataService = require(`../../data-service/comment`);
const {mockData} = require(`./mockData`);

const createAPI = () => {
  const app = express();
  app.use(express.json());
  comments(app, new DataService(mockData));
  return app;
};

describe(`API returns a list of all comments`, () => {

  test(`Status code 200`, async () => {
    const app = createAPI();
    const response = await request(app).get(`/comments`);

    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`Returns a list of 14 comments`, async () => {
    const app = createAPI();
    const response = await request(app).get(`/comments`);

    expect(response.body.length).toBe(14);
  });

  test(`Last comment's id equals "zxLcZX"`, async () => {
    const app = createAPI();
    const response = await request(app).get(`/comments`);

    expect(response.body[response.body.length - 1].id).toBe(`zxLcZX`);
  });

});
