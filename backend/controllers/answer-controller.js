const HttpError = require('../util/http-error')
const { validationResult } = require('express-validator')
const Student = require('../models/Student')
const Answer = require('../models/Answer')
const Quiz = require('../models/Quiz')

const sendAnswer = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
      )
    }

    const creator = req.userData.userId

    const student = await Student.findById(creator)
    if (!student) {
      return next(new HttpError('Only a student can send answers!', 403))
    }

    const { answers, quiz } = req.body
    let grade = 0

    const quizTaken = await Quiz.findById(quiz)

    quizTaken.quiz.forEach((element) => {
      element.answers.forEach((answer) => {
        if (answer.isCorrect === true) {
          answers.forEach((text) => {
            if (text === answer.text) grade++
          })
        }
      })
    })
    const answer = await Answer.create({
      answers,
      quiz,
      grade,
    })

    res.status(201).json({
      success: true,
      data: answer,
    })
  } catch (err) {
    next(err)
  }
}

exports.sendAnswer = sendAnswer
