const { Pool } = require('pg');

const client = new Pool({
 user: 'jxersshw',
 host: 'tai.db.elephantsql.com',
 database: 'jxersshw',
 password: 'vhzutWT1BqRTbGPYxjnvWVkAkQEUQ5XK',
 port: 5432,
});

module.exports = client