const knex = require('knex')({
  client: 'pg',
  connection: {
    host: process.env.DEPLOY_HOST,
    port: process.env.DEPLOY_PORT,
    user: process.env.DEPLOY_USER,
    password: process.env.DEPLOY_PASSWORD,
    database: process.env.DEPLOY_DATABASE,
    uri: process.env.DEPLOY_URI,
    ssl: { rejectUnauthorized: false },

  }
});


module.exports = {
  knex,
};