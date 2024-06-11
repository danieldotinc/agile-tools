const env = require('dotenv');
const mongoose = require('mongoose');

env.config();

module.exports = (initialized) => {
  const db = process.env.DATABASE_URI || 'url-not-found';
  mongoose.connect(db).then(() => {
    console.log(`Connected to database...`);
  });
  return initialized;
};
