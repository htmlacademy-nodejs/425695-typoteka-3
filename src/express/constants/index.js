'use strict';

const DEFAULT_SERVER_PORT = 8080;
const PUBLIC_DIR = 'public';
const UPLOAD_DIR = 'upload';

const HttpMethod = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
};
const HttpCode = {
  CREATED: 201,
  OK: 200,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
};
module.exports = {
  DEFAULT_SERVER_PORT,
  HttpCode,
  HttpMethod,
  PUBLIC_DIR,
  UPLOAD_DIR,
};
