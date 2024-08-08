const config = require('./index');

module.exports = {
  development: {
    username: config.db.username,
    password: config.db.password,
    database: config.db.database,
    host: config.db.host,
    dialect: 'postgres',
    schema: config.db.schema // Add schema here
  },
  test: {
    username: config.db.username,
    password: config.db.password,
    database: config.db.testName,
    host: config.db.host,
    dialect: 'postgres',
    schema: config.db.schema // Add schema here
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    schema: config.db.schema // Add schema here
  }
};
