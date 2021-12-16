'use strict';

const {Server} = require('socket.io');
const {DEFAULT_SERVER_PORT, HttpMethod} = require('../../express/constants');

module.exports = (server) => {
  return new Server(server, {
    cors: {
      origins: [`localhost:${DEFAULT_SERVER_PORT}`],
      methods: [HttpMethod.GET]
    }
  });
};
