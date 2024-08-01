require('dotenv').config();

module.exports = {
  environment: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 8000,
  db: {
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    name: process.env.DB_NAME || 'database_development',
    testName: process.env.DB_TEST_NAME || 'database_test',
    host: process.env.DB_HOST || '127.0.0.1'
  },
  jwtConfig: {
    secret: process.env.JWT_SECRET || 'secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h'
  }
};
