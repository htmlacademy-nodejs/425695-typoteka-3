'use strict';
const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../../lib/init-db`);
const {HttpCode} = require(`../../constants`);
const articles = require(`./articles`);
const DataService = require(`../../data-service/article`);
const CommentService = require(`../../data-service/comment`);
const {mockArticles, mockCategories, mockUsers} = require(`./mockData`);

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDB(mockDB, {categories: mockCategories, articles: mockArticles, users: mockUsers});
  const app = express();
  app.use(express.json());
  articles(app, new DataService(mockDB), new CommentService(mockDB));
  return app;
};

const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});

const app = express();
app.use(express.json());

beforeAll(async () => {
  await initDB(mockDB, {categories: mockCategories, articles: mockArticles, users: mockUsers});
  articles(app, new DataService(mockDB), new CommentService(mockDB));
});

const newArticle = {
  categories: [1, 2],
  announce: `Вы можете достичь всего.`,
  picture: `cat.jpg`,
  fullText: `Собрать камни бесконечности легко, если вы прирожденный герой. Простые ежедневные упражнения помогут достичь успеха. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Как начать действовать? Для начала просто соберитесь. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Программировать не настолько сложно, как об этом говорят. Отправляю исключительно Почтой России. Такая только у меня и у Майкла Джексона. Альбом стал настоящим открытием года.`,
  title: `Учим HTML и CSS.`,
};
const newComment = {
  text: `Валидному комментарию достаточно этого поля`
};
describe(`API returns a list of all articles`, () => {

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles`);
  });

  test(`Status code 200`, async () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`Returns a list of 1 article`, async () => {
    expect(response.body.length).toBe(1);
  });

  test(`First article's title equals "Что такое золотое сечение."`, async () => {
    expect(response.body[0].title).toBe(`Что такое золотое сечение.`);
  });

});

describe(`API returns an article with given id`, () => {
  let response;

  beforeAll(async () => {
    // const app = await createAPI();
    response = await request(app)
      .get(`/articles/1`);
  });

  test(`Status code 200`, async () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`Article's title is "Что такое золотое сечение."`, async () => {
    expect(response.body.title) .toBe(`Что такое золотое сечение.`);
  });

});

describe(`API creates an article if data is valid`, () => {

  let response;

  test(`Status code 201`, async () => {
    response = await request(app)
      .post(`/articles`)
      .send(newArticle);

    expect(response.statusCode).toBe(HttpCode.CREATED);
  });


  test(`Articles count is changed`, async () => {
    await request(app)
      .get(`/articles`)
      .expect((res) => expect(res.body.length).toBe(2));
  });
});

describe(`API refuses to create an article if data is invalid`, () => {

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

  test(`When field type is wrong response code is 400`, async () => {
    const badArticles = [
      {...newArticle, categories: `true`},
      {...newArticle, picture: 12345},
      {...newArticle, categories: `Котики`}
    ];
    for (const badOffer of badArticles) {
      await request(app)
        .post(`/articles`)
        .send(badOffer)
        .expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API changes existent article`, () => {
  test(`Status code 200`, async () => {
    const response = await request(app)
      .put(`/articles/1`)
      .send(newArticle);
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`Returns 'true'`, async () => {
    const response = await request(app)
      .put(`/articles/1`)
      .send(newArticle);
    expect(response.body).toEqual(true);
  });

  test(`Article is really changed`, async () => {
    await request(app)
      .put(`/articles/1`)
      .send(newArticle);
    await request(app)
      .get(`/articles/1`)
      .expect((res) => expect(res.body.title).toBe(`Учим HTML и CSS.`));
  });

});

test(`API returns status code 404 when trying to change non-existent article`, () => {

  const validArticle = {
    categories: [1, 2],
    picture: `cat.jpg`,
    announce: `Вы можете достичь всего.`,
    fullText: `Берём и учим`,
    title: `Учим HTML и CSS.`,
  };

  return request(app)
    .put(`/articles/NOEXST`)
    .send(validArticle)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an article with invalid data`, () => {

  const invalidArticle = {
    announce: `Вы можете достичь всего.`,
    categories: `Web`,
    fullText: `Берём и учим`,
  };

  return request(app)
    .put(`/articles/1`)
    .send(invalidArticle)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an article`, () => {

  test(`Status code 200`, async () => {
    const api = await createAPI();
    const response = await request(api).delete(`/articles/1`);

    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`Returns 'true'`, async () => {
    const api = await createAPI();
    const response = await request(api).delete(`/articles/1`);
    expect(response.body).toBe(true);
  });

  test(`Articles count is 0 now`, async () => {
    const api = await createAPI();
    await request(api).delete(`/articles/1`);
    await request(api)
      .get(`/articles`)
      .expect((res) => expect(res.body.length).toBe(0));
  });

});

test(`API refuses to delete non-existent article`, async () => {

  const api = await createAPI();

  return request(api)
    .delete(`/articles/NOEXST`)
    .expect(HttpCode.NOT_FOUND);

});

describe(`API returns a list of comments to given article`, () => {

  test(`Status code 200`, async () => {
    const api = await createAPI();
    const response = await request(api).get(`/articles/1/comments`);

    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`Returns list of 0 comments`, async () => {
    const api = await createAPI();
    const response = await request(api)
    .get(`/articles/1/comments`)
    .query({comments: true});

    expect(response.body.length).toBe(3);
  });

});

describe(`API creates a comment if data is valid`, () => {

  // test(`Status code 201`, async () => {
  //   const api = await createAPI();
  //   const response = await request(api)
  //     .post(`/articles/1/comments`)
  //     .send(newComment);

  //   expect(response.statusCode).toBe(HttpCode.CREATED);
  // });

  test(`Comments count is changed`, async () => {
    const api = await createAPI();
    await request(api)
      .post(`/articles/1/comments`)
      .send(newComment);

    await request(api)
      .get(`/articles/1/comments`)
      .query({comments: true})
      .expect((res) => expect(res.body.length).toBe(3));
  });

});

test(`API refuses to create a comment to non-existent article and returns status code 404`, async () => {

  const api = await createAPI();

  return request(api)
    .post(`/articles/NOEXST/comments`)
    .send({text: `Неважно`})
    .expect(HttpCode.NOT_FOUND);

});

test(`API refuses to create a comment when data is invalid, and returns status code 400`, async () => {

  const api = await createAPI();

  return request(api)
    .post(`/articles/1/comments`)
    .send({})
    .expect(HttpCode.BAD_REQUEST);

});

// describe(`API correctly deletes a comment`, () => {

//   test(`Status code 204`, async () => {
//     const api = await createAPI();
//     await request(api)
//       .post(`/articles/1/comments`)
//       .send(newComment);
//     const response = await request(api).delete(`/articles/1/comments/1`);

//     expect(response.statusCode).toBe(HttpCode.NO_CONTENT);
//   });

// test(`Comments count is 2 now`, async () => {
//   const app = createAPI();
//   await request(app).delete(`/articles/0Xfnhn/comments/uaPKrW`);

//   await request(app)
//     .get(`/articles/0Xfnhn/comments`)
//     .expect((res) => expect(res.body.length).toBe(2));
// });

// });

test(`API refuses to delete non-existent comment`, async () => {

  return request(app)
    .delete(`/articles/1/comments/123`)
    .expect(HttpCode.NOT_FOUND);

});

test(`API refuses to delete a comment to non-existent article`, () => {

  return request(app)
    .delete(`/articles/123/comments/NO_MATTER`)
    .expect(HttpCode.NOT_FOUND);

});
