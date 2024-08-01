const config = require('./index');

module.exports = {
  development: {
    username: config.db.username,
    password: config.db.password,
    database: config.db.name,
    host: config.db.host,
    dialect: 'postgres'
  },
  test: {
    username: config.db.username,
    password: config.db.password,
    database: config.db.testName,
    host: config.db.host,
    dialect: 'postgres'
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};
