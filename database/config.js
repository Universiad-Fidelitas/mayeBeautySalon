require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
const config = {
    db: {
      host: process.env.DB_HOST,
      user: process.env.USERNAME,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      connectTimeout: process.env.CONNECTION_TIMEOUT
    },
    listPerPage: 2,
};
  module.exports = config;