const express = require('express')
const { check } = require('express-validator')
const checkAuth = require('../middleware/check-auth')

const authController = require('../controllers/auth-controllers')
const router = express.Router()



router.post(
  '/signup/student',
  [
    check('name').notEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 6 })
  ],
  authController.studentSignup
)

router.post('/login/student', authController.studentLogin)

router.post(
  '/signup/professor',
  [
    check('name').notEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 6 })
  ],
  authController.professorSignup
)

router.post('/login/professor', authController.professorLogin)

router.use(checkAuth)
router.get('/me', authController.getMe)

module.exports = router
