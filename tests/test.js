const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../db/models'); 

let cookies;
let csrfToken;

// Function to grab CSRF token
const getCsrfToken = async () => {
  const res = await request(app).get('/api/csrf/restore');
  const cookies = res.headers['set-cookie'];
  const csrfToken = cookies.find(cookie => cookie.includes('XSRF-TOKEN')).split(';')[0].split('=')[1];
  return { cookies, csrfToken };
};

// Before each test, reset the database and get a fresh CSRF token
beforeEach(async () => {
  await sequelize.sync({ force: true });
  const csrfData = await getCsrfToken();
  cookies = csrfData.cookies;
  csrfToken = csrfData.csrfToken;
});

/***********************************/

// Test for user registration
test('should register a user', async () => {
  const res = await request(app)
    .post('/api/users/signup')
    .set('Cookie', cookies)
    .send({
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'john@example.com',
      password: 'password',
      _csrf: csrfToken
    });
  expect(res.statusCode).toEqual(200);
  expect(res.body.user).toHaveProperty('id');
});


/***********************************/

// Test for user login
test('should login a user', async () => {
  await request(app)
    .post('/api/users/signup')
    .set('Cookie', cookies)
    .send({
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'john@example.com',
      password: 'password',
      _csrf: csrfToken
    });

  const res = await request(app)
    .post('/api/session')
    .set('Cookie', cookies)
    .send({
      credential: 'john@example.com',
      password: 'password',
      _csrf: csrfToken
    });
  expect(res.statusCode).toEqual(200);
  expect(res.body.user).toHaveProperty('id');
});

/***********************************/

// Test for retrieving user profile
test('should retrieve user profile', async () => {
  await request(app)
    .post('/api/users/signup')
    .set('Cookie', cookies)
    .send({
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'john@example.com',
      password: 'password',
      _csrf: csrfToken
    });

  const loginRes = await request(app)
    .post('/api/session')
    .set('Cookie', cookies)
    .send({
      credential: 'john@example.com',
      password: 'password',
      _csrf: csrfToken
    });

  const loginCookies = loginRes.headers['set-cookie'];

  const profileRes = await request(app)
    .get('/api/users/profile')
    .set('Cookie', loginCookies);
  expect(profileRes.statusCode).toEqual(200);
  expect(profileRes.body.user).toHaveProperty('id');
});


/***********************************/

// Test for updating user
test('should update user', async () => {
  // Signup
  await request(app)
    .post('/api/users/signup')
    .set('Cookie', cookies)
    .send({
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'john@example.com',
      password: 'password',
      _csrf: csrfToken
    });

  // Login
  const loginRes = await request(app)
    .post('/api/session')
    .set('Cookie', cookies)
    .send({
      credential: 'john@example.com',
      password: 'password',
      _csrf: csrfToken
    });

  // New session cookies after login
  const loginCookies = loginRes.headers['set-cookie'];

  // Get new CSRF token after login
  const newCsrfData = await getCsrfToken();
  const newCsrfToken = newCsrfData.csrfToken;
  const newCookies = newCsrfData.cookies.concat(loginCookies);

  // Update user
  const updateRes = await request(app)
    .put('/api/users/profile')
    .set('Cookie', newCookies)
    .send({
      firstName: 'Johnny',
      lastName: 'Doe',
      _csrf: newCsrfToken
    });

  expect(updateRes.statusCode).toEqual(200);
  expect(updateRes.body.user.firstName).toEqual('Johnny');
});


/***********************************/

// Test for deleting user
test('should delete user', async () => {
  // Signup
  await request(app)
    .post('/api/users/signup')
    .set('Cookie', cookies)
    .send({
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'john@example.com',
      password: 'password',
      _csrf: csrfToken
    });

  // Login
  const loginRes = await request(app)
    .post('/api/session')
    .set('Cookie', cookies)
    .send({
      credential: 'john@example.com',
      password: 'password',
      _csrf: csrfToken
    });

  // New session cookies after login
  const loginCookies = loginRes.headers['set-cookie'];

  // Get new CSRF token after login
  const newCsrfData = await getCsrfToken();
  const newCsrfToken = newCsrfData.csrfToken;
  const newCookies = newCsrfData.cookies.concat(loginCookies);

  // Delete user
  const deleteRes = await request(app)
    .delete('/api/users/profile')
    .set('Cookie', newCookies)
    .send({
      _csrf: newCsrfToken
    });

  expect(deleteRes.statusCode).toEqual(200);
  expect(deleteRes.body.message).toEqual('User deleted successfully');
});

/***********************************/

// Test for logging out user
test('should logout user', async () => {
  // Signup
  await request(app)
    .post('/api/users/signup')
    .set('Cookie', cookies)
    .send({
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'john@example.com',
      password: 'password',
      _csrf: csrfToken
    });

  // Login
  const loginRes = await request(app)
    .post('/api/session')
    .set('Cookie', cookies)
    .send({
      credential: 'john@example.com',
      password: 'password',
      _csrf: csrfToken
    });

  // New session cookies after login
  const loginCookies = loginRes.headers['set-cookie'];

  // Get CSRF token after login
  const newCsrfData = await getCsrfToken();
  const newCsrfToken = newCsrfData.csrfToken;
  const newCookies = newCsrfData.cookies.concat(loginCookies);

  // Logout
  const logoutRes = await request(app)
    .delete('/api/session')
    .set('Cookie', newCookies)
    .send({
      _csrf: newCsrfToken
    });

  expect(logoutRes.statusCode).toEqual(200);
  expect(logoutRes.body.message).toEqual('success');
});
