const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

// Validation for Login
const validateLogin = [
  check('credential')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Email or username is required.'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Password is required.'),
  handleValidationErrors
];

/**
 * @swagger
 * tags:
 *   name: Session
 *   description: User session management
 */

/**
 * @swagger
 * /api/session:
 *   get:
 *     summary: Restore session user
 *     tags: [Session]
 *     responses:
 *       200:
 *         description: User information
  *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     firstName:
 *                       type: string
 *                       example: "John"
 *                     lastName:
 *                       type: string
 *                       example: "Smith"
 *                     username:
 *                       type: string
 *                       example: "johnsmith"
 *                     email:
 *                       type: string
 *                       example: "john.smith@test.com"
 *                 message:
 *                   type: string
 *                   example: "No user session found"
 */

// Restore session user
router.get(
  '/',
  restoreUser,
  (req, res) => {
    const { user } = req;
    if (user) {
      return res.json({
        user: user.toSafeObject(),
      });
    } else return res.json({ user: null });
  }
);

/**
 * @swagger
 * /api/session:
 *   post:
 *     summary: User login
 *     tags: [Session]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               credential:
 *                 type: string
 *                 example: johnsmith
 *                 description: Email or username
 *               password:
 *                 type: string
 *                 example: password
 *     responses:
 *       200:
 *         description: User successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     firstName:
 *                       type: string
 *                       example: "John"
 *                     lastName:
 *                       type: string
 *                       example: "Smith"
 *                     username:
 *                       type: string
 *                       example: "johnsmith"
 *                     email:
 *                       type: string
 *                       example: "john.smith@test.com"
 *       401:
 *         description: Login failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   example: "Login failed"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["The provided credentials were invalid."]
 */
// Log in
router.post(
  '/',
  validateLogin,
  async (req, res, next) => {
    const { credential, password } = req.body;
    const user = await User.login({ credential, password });

    if (!user) {
      const err = new Error('Login failed');
      err.status = 401;
      err.title = 'Login failed';
      err.errors = ['The provided credentials were invalid.'];
      return next(err);
    }

    await setTokenCookie(res, user);
    return res.json({
      user: user.toSafeObject()
    });
  }
);


/**
 * @swagger
 * /api/session:
 *   delete:
 *     summary: User logout
 *     tags: [Session]
 *     responses:
 *       200:
 *         description: User successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: success
 */

// Log out
router.delete(
    '/',
    (req, res) => {
      res.clearCookie('token');
      res.clearCookie('XSRF-TOKEN');
      return res.json({ message: 'success' });
    }
  );
module.exports = router;
