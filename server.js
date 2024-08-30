const next = require('next');

const db = require('./backend/start/db');
const init = require('./backend/start/init');
const listeners = require('./backend/start/listeners');
const start = require('./backend/start');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });

app
  .prepare()
  .then(() => init(app))
  .then((initialized) => db(initialized))
  .then((loaded) => listeners(loaded))
  .then((ready) => start(ready));
