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

    const quizTaken = await Quiz.findById(quiz)
    
    console.log(quizTaken._id)
    const publishedAnswer = await Answer.findOne({ quiz: quizTaken })
    if (publishedAnswer) {
      return next(
        new HttpError(
          `The student with the ID ${req.userData.userId} has already sent an answer`,
          400
        )
      )
    }

    let grade = 0

    for(let i = 0; i < quizTaken.quiz.length; i++) {
      // console.log('i =', i)
      for (let j = 0; j < quizTaken.quiz[i].answers.length; j++) {
        // console.log('j =', j)
        if(quizTaken.quiz[i].answers[j].isCorrect === true) {
          // console.log('am gasit un true')
          for(let k = 0; k < answers.length; k++) {
            if(quizTaken.quiz[i].answers[j].text === answers[j]){
              grade++;
            }
          }
        }
      }
    }

    const answer = await Answer.create({
      answers,
      quiz,
      grade,
      student,
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
