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

// Get User Profile
router.get(
  '/profile',
  restoreUser,
  requireAuth,
  async (req, res) => {
    const { user } = req;
    res.json({ user: user.toSafeObject() });
  }
);

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

// Delete User
router.delete(
  '/',
   restoreUser,
  requireAuth,
  async (req, res, next) => {
    const { user } = req;

    try {
      await user.destroy();
      res.json({ message: 'Account deleted successfully.' });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
