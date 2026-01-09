const Pool = require('pg').Pool;

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'test',
  user: 'postgres',
  password: '',
  max: 30
})

module.exports = pool;
