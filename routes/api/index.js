const express = require('express');
const router = express.Router();

const usersRouter = require('./users.js');
const sessionRouter = require('./session.js');

router.use('/users', usersRouter);
router.use('/session', sessionRouter);

module.exports = router;
