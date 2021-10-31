'use strict';

const DEFAULT_SERVER_PORT = 8080;
const PUBLIC_DIR = `public`;
const UPLOAD_DIR = `upload`;

const HttpMethod = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};
module.exports = {
  DEFAULT_SERVER_PORT,
  HttpMethod,
  PUBLIC_DIR,
  UPLOAD_DIR,
};
