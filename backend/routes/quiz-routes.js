const express = require('express')
const { check } = require('express-validator')
const quizControllers = require('../controllers/quiz-controller')
const router = express.Router()
const checkAuth = require('../middleware/check-auth')

router.use(checkAuth)

router.get('/prof', quizControllers.getQuizzesForProf)
router.get('/student', quizControllers.getQuizzesForStudent)
router.get('/', quizControllers.getAllQuizzes)
router.get('/:id', quizControllers.getQuizzesForCourse)
router.get('/course/:id', quizControllers.getQuizById)
router.get('/access/:id', quizControllers.getQuizByAccessCode)
router.post('/', quizControllers.createQuiz)
router.delete('/:id', quizControllers.deleteQuiz)
router.patch('/:id', quizControllers.updateQuiz)

module.exports = router
