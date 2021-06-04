'use strict';
const express = require(`express`);
const request = require(`supertest`);

const {HttpCode} = require(`../../constants`);
const articles = require(`./articles`);
const DataService = require(`../../data-service/article`);
const CommentService = require(`../../data-service/comment`);
const {mockData} = require(`./mockData`);

const createAPI = () => {
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData));
  app.use(express.json());
  articles(app, new DataService(cloneData), new CommentService(cloneData));
  return app;
};

describe(`API returns a list of all articles`, () => {

  test(`Status code 200`, async () => {
    const app = createAPI();
    const response = await request(app).get(`/articles`);

    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`Returns a list of 5 articles`, async () => {
    const app = createAPI();
    const response = await request(app).get(`/articles`);

    expect(response.body.length).toBe(5);
  });

  test(`First article's id equals "0Xfnhn"`, async () => {
    const app = createAPI();
    const response = await request(app).get(`/articles`);

    expect(response.body[0].id).toBe(`0Xfnhn`);
  });

});

describe(`API returns an article with given id`, () => {

  test(`Status code 200`, async () => {
    const app = createAPI();
    const response = await request(app).get(`/articles/0Xfnhn`);

    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`Article's title is "Что такое золотое сечение."`, async () => {
    const app = createAPI();
    const response = await request(app).get(`/articles/0Xfnhn`);

    expect(response.body.title) .toBe(`Что такое золотое сечение.`);
  });

});

describe(`API creates an article if data is valid`, () => {

  const newArticle = {
    announce: `Вы можете достичь всего.`,
    categories: `Web`,
    createdDate: new Date().toLocaleString(),
    fullText: `Берём и учим`,
    title: `Учим HTML и CSS.`,
  };


  test(`Status code 201`, async () => {
    const app = createAPI();
    const response = await request(app)
      .post(`/articles`)
      .send(newArticle);

    expect(response.statusCode).toBe(HttpCode.CREATED);
  });


  test(`Returns article created`, async () => {
    const app = createAPI();
    const response = await request(app)
      .post(`/articles`)
      .send(newArticle);
    expect(response.body).toEqual(expect.objectContaining(newArticle));
  });

  test(`Articles count is changed`, async () => {
    const app = createAPI();
    await request(app)
      .post(`/articles`)
      .send(newArticle);

    await request(app)
      .get(`/articles`)
      .expect((res) => expect(res.body.length).toBe(6));
  });
});

describe(`API refuses to create an article if data is invalid`, () => {

  const newArticle = {
    announce: `Вы можете достичь всего.`,
    categories: `Web`,
    fullText: `Берём и учим`,
    title: `Учим HTML и CSS.`,
  };
  const app = createAPI();

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newArticle)) {
      const badArticle = {...newArticle};
      delete badArticle[key];
      await request(app)
        .post(`/articles`)
        .send(badArticle)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

});

describe(`API changes existent article`, () => {

  const newArticle = {
    announce: `Вы можете достичь всего.`,
    categories: `Web`,
    createdDate: new Date().toLocaleString(),
    fullText: `Берём и учим`,
    title: `Учим HTML и CSS.`,
  };

  test(`Status code 200`, async () => {
    const app = createAPI();
    const response = await request(app)
      .put(`/articles/QjDCKc`)
      .send(newArticle);
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`Returns changed article`, async () => {
    const app = createAPI();
    const response = await request(app)
      .put(`/articles/QjDCKc`)
      .send(newArticle);
    expect(response.body).toEqual(expect.objectContaining(newArticle));
  });

  test(`Article is really changed`, async () => {
    const app = createAPI();
    await request(app)
      .put(`/articles/QjDCKc`)
      .send(newArticle);
    await request(app)
      .get(`/articles/QjDCKc`)
      .expect((res) => expect(res.body.title).toBe(`Учим HTML и CSS.`));
  });

});

test(`API returns status code 404 when trying to change non-existent article`, () => {

  const app = createAPI();

  const validArticle = {
    announce: `Вы можете достичь всего.`,
    categories: `Web`,
    fullText: `Берём и учим`,
    title: `Учим HTML и CSS.`,
  };

  return request(app)
    .put(`/articles/NOEXST`)
    .send(validArticle)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an article with invalid data`, () => {

  const app = createAPI();

  const invalidArticle = {
    announce: `Вы можете достичь всего.`,
    categories: `Web`,
    fullText: `Берём и учим`,
  };

  return request(app)
    .put(`/articles/QjDCKc`)
    .send(invalidArticle)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an article`, () => {

  test(`Status code 204`, async () => {
    const app = createAPI();
    const response = await request(app).delete(`/articles/QjDCKc`);

    expect(response.statusCode).toBe(HttpCode.NO_CONTENT);
  });

  test(`Articles count is 4 now`, async () => {
    const app = createAPI();
    await request(app).delete(`/articles/QjDCKc`);
    await request(app)
      .get(`/articles`)
      .expect((res) => expect(res.body.length).toBe(4));
  });

});

test(`API refuses to delete non-existent article`, () => {

  const app = createAPI();

  return request(app)
    .delete(`/articles/NOEXST`)
    .expect(HttpCode.NOT_FOUND);

});

describe(`API returns a list of comments to given article`, () => {

  test(`Status code 200`, async () => {
    const app = createAPI();
    const response = await request(app).get(`/articles/0Xfnhn/comments`);

    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`Returns list of 3 comments`, async () => {
    const app = createAPI();
    const response = await request(app).get(`/articles/0Xfnhn/comments`);

    expect(response.body.length).toBe(3);
  });

  test(`First comment's text is "Согласен с автором! Мне кажется или я уже читал это где-то?"`, async () => {
    const app = createAPI();
    const response = await request(app).get(`/articles/0Xfnhn/comments`);

    expect(response.body[0].text).toBe(`Согласен с автором! Мне кажется или я уже читал это где-то?`);
  });

});

describe(`API creates a comment if data is valid`, () => {

  const newComment = {
    text: `Валидному комментарию достаточно этого поля`
  };

  test(`Status code 201`, async () => {
    const app = createAPI();
    const response = await request(app)
      .post(`/articles/0Xfnhn/comments`)
      .send(newComment);

    expect(response.statusCode).toBe(HttpCode.CREATED);
  });

  test(`Comments count is changed`, async () => {
    const app = createAPI();
    await request(app)
      .post(`/articles/0Xfnhn/comments`)
      .send(newComment);

    await request(app)
      .get(`/articles/0Xfnhn/comments`)
      .expect((res) => expect(res.body.length).toBe(4));
  });

});

test(`API refuses to create a comment to non-existent article and returns status code 404`, () => {

  const app = createAPI();

  return request(app)
    .post(`/articles/NOEXST/comments`)
    .send({
      text: `Неважно`
    })
    .expect(HttpCode.NOT_FOUND);

});

test(`API refuses to create a comment when data is invalid, and returns status code 400`, () => {

  const app = createAPI();

  return request(app)
    .post(`/articles/0Xfnhn/comments`)
    .send({})
    .expect(HttpCode.BAD_REQUEST);

});

describe(`API correctly deletes a comment`, () => {

  test(`Status code 204`, async () => {
    const app = createAPI();
    const response = await request(app).delete(`/articles/0Xfnhn/comments/uaPKrW`);

    expect(response.statusCode).toBe(HttpCode.NO_CONTENT);
  });

  test(`Comments count is 2 now`, async () => {
    const app = createAPI();
    await request(app).delete(`/articles/0Xfnhn/comments/uaPKrW`);

    await request(app)
      .get(`/articles/0Xfnhn/comments`)
      .expect((res) => expect(res.body.length).toBe(2));
  });

});

test(`API refuses to delete non-existent comment`, () => {

  const app = createAPI();

  return request(app)
    .delete(`/articles/0Xfnhn/comments/NOEXST`)
    .expect(HttpCode.NOT_FOUND);

});

test(`API refuses to delete a comment to non-existent article`, () => {

  const app = createAPI();

  return request(app)
    .delete(`/articles/NOEXST/comments/NO_MATTER`)
    .expect(HttpCode.NOT_FOUND);

});
