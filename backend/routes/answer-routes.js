const express = require('express')
const { check } = require('express-validator')
const answerController = require('../controllers/answer-controller')
const router = express.Router()
const checkAuth = require('../middleware/check-auth')

router.use(checkAuth)

router.patch('/', answerController.patchAnswer)
router.post('/first', answerController.sendFirstAnswer)
router.get('/', answerController.getAnswers)
router.get('/stats', answerController.getAnswersForStats)
router.get('/courseName/:title', answerController.getAnswerByCourse)
router.get('/quiz/:id', answerController.getAnswersForQuiz)
router.get('/:id', answerController.getAnswerById)

module.exports = router
