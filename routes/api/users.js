const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');
const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('firstName')
    .exists({ checkFalsy: true })
    .isLength({ min: 2 })
    .withMessage('First name is required with at least 2 characters.'),
  check('lastName')
    .exists({ checkFalsy: true })
    .isLength({ min: 2 })
    .withMessage('Last name is required with at least 2 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /api/users/signup:
 *   post:
 *     summary: User registration
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Smith"
 *               username:
 *                 type: string
 *                 example: "johnsmith"
 *               email:
 *                 type: string
 *                 example: "john.smith@test.com"
 *               password:
 *                 type: string
 *                 example: "password"
  *     responses:
 *       200:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 firstName:
 *                   type: string
 *                   example: "John"
 *                 lastName:
 *                   type: string
 *                   example: "Smith"
 *                 username:
 *                   type: string
 *                   example: "johnsmith"
 *                 email:
 *                   type: string
 *                   example: "john.smith@test.com"
 */
// Sign Up
router.post(
  '/signup',
  validateSignup,
  async (req, res, next) => {
    const { email, password, username, firstName, lastName } = req.body;

    try {
      const user = await User.signup({ email, username, password, firstName, lastName });
      await setTokenCookie(res, user);

      return res.json({
        user: user.toSafeObject()
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get Current User
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 firstName:
 *                   type: string
 *                   example: "John"
 *                 lastName:
 *                   type: string
 *                   example: "Smith"
 *                 username:
 *                   type: string
 *                   example: "johnsmith"
 *                 email:
 *                   type: string
 *                   example: "john.smith@test.com"
 */
// Get Current User
router.get(
  '/profile',
  restoreUser,
  requireAuth,
  async (req, res) => {
    const { user } = req;
    res.json({ user: user.toSafeObject() });
  }
);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "Charlie"
 *               lastName:
 *                 type: string
 *                 example: "Chaplin"
 *               username:
 *                 type: string
 *                 example: "charliechaplin"
 *               email:
 *                 type: string
 *                 example: "charlie.chaplin@test.com"
 *     responses:
 *       200:
 *         description: User profile updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 firstName:
 *                   type: string
 *                   example: "Charlie"
 *                 lastName:
 *                   type: string
 *                   example: "Chaplin"
 *                 username:
 *                   type: string
 *                   example: "charliechaplin"
 *                 email:
 *                   type: string
 *                   example: "charlie.chaplin@test.com"
 */

// Update User Profile
router.put(
  '/profile',
  restoreUser,
  requireAuth,
  async (req, res, next) => {
    const { user } = req;
    const { firstName, lastName, email, username } = req.body;

    try {
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (email) user.email = email;
      if (username) user.username = username;

      await user.save();

      res.json({ user: user.toSafeObject() });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @swagger
 * /api/users/profile:
 *   delete:
 *     summary: Delete user account
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User account deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User deleted successfully
 */
// Delete User
router.delete(
  '/profile',
   restoreUser,
  requireAuth,
  async (req, res, next) => {
    const { user } = req;

    try {
      await user.destroy();
      res.json({ message: 'User deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
