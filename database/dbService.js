const mysql = require('mysql2/promise');
const config = require('./config');

const query = async (sql, params) => {
  const connection = await mysql.createConnection(config.db);
  try {
    const [results, ] = await connection.execute(sql, params);
    return results;
  } finally {
    await connection.end();
  }
};

module.exports = {
  query
}