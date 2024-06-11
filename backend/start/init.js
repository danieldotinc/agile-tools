const { parse } = require('url');
const socketIo = require('socket.io');
const { createServer } = require('http');

module.exports = (app) => {
  const handle = app.getRequestHandler();
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  return { io: socketIo(server), server };
};
