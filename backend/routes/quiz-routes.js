const express = require('express')
const { check } = require('express-validator')
const quizControllers = require('../controllers/quiz-controller')
const router = express.Router()
const checkAuth = require('../middleware/check-auth')

router.use(checkAuth)

router.get('/', quizControllers.getAllQuizzes)
router.post('/', quizControllers.createQuiz)
router.delete('/:id', quizControllers.deleteQuiz)
router.get('/prof', quizControllers.getQuizzesForProf)
router.get('/student', quizControllers.getQuizzesForStudent)

module.exports = router
