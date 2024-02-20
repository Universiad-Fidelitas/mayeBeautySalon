require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
const config = {
    db: {
      host: process.env.DB_HOST,
      user: process.env.USERDB,
      password: process.env.PASSWORDDB,
      database: process.env.DATABASE,
      connectTimeout: process.env.CONNECTION_TIMEOUT
    },
    listPerPage: 50,
};
  module.exports = config;