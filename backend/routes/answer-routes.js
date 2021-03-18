const express = require('express')
const { check } = require('express-validator')
const answerController = require('../controllers/answer-controller')
const router = express.Router()
const checkAuth = require('../middleware/check-auth')

router.use(checkAuth)

router.post('/', answerController.sendAnswer)

module.exports = router
