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
    for (let i = 0; i < quizTaken.quiz.length; i++) {
      for (let j = 0; j < quizTaken.quiz[i].answers.length; j++) {
        if (quizTaken.quiz[i].answers[j].isCorrect === true) {
          for (let k = 0; k < answers.length; k++) {
            for (let l = 0; l < answers[k].length; l++) {
              if (quizTaken.quiz[i].answers[j].text === answers[k][l]) {
                grade += quizTaken.quiz[i].answers[j].points
              }
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

    await Answer.deleteOne(answer)

    res.status(201).json({
      success: true,
      data: answer,
    })
  } catch (err) {
    next(err)
  }
}

const sendFirstAnswer = async (req, res, next) => {
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
    quizTaken.quiz[0].answers.forEach((element) => {
      if (answers[0].includes(element.text)) grade += element.points
    })

    const answer = await Answer.create({
      answers,
      grade,
      quiz,
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

const patchAnswer = async (req, res, next) => {
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

    let publishedAnswer = await Answer.findOne({ quiz: quizTaken })

    let grader = publishedAnswer.grade

    try {
      quizTaken.quiz[publishedAnswer.answers.length].answers.forEach(
        (element) => {
          if (answers[0].includes(element.text)) {
            grader += element.points
          }
        }
      )
    } catch (err) {
      return next(
        new HttpError('Cannot add answer if the question does not exist.', 400)
      )
    }

    const newAnswers = publishedAnswer.answers.concat(answers)
    const fieldsToUpdate = {
      answers: newAnswers,
      grade: grader,
    }

    const nextAnswer = await Answer.findByIdAndUpdate(
      publishedAnswer._id,
      fieldsToUpdate,
      {
        new: true,
      }
    )

    res.status(200).json({
      success: true,
      data: nextAnswer,
    })
  } catch (err) {
    next(err)
  }
}

const getAnswers = async (req, res, next) => {
  try {
    const student = await Student.findById(req.userData.userId)

    const answers = await Answer.find({ student: student._id })

    let grades = []
    let quizTitle = []
    let ans = []
    answers.forEach((element) => {
      grades.push(element.grade)
      ans.push(element.answers)
    })

    let quiz = []
    for (let index = 0; index < answers.length; index++) {
      quiz.push(await Quiz.findById(answers[index].quiz))
      quizTitle.push(quiz[index].title)
    }

    let theQuiz = []
    for (let i = 0; i < answers.length; i++) {
      let data = {
        title: quizTitle[i],
        grades: grades[i],
        answers: ans[i],
      }
      theQuiz.push(data)
    }

    res.status(200).json({
      success: true,
      count: answers.length,
      data: theQuiz,
    })
  } catch (err) {
    next(err)
  }
}

exports.sendAnswer = sendAnswer
exports.sendFirstAnswer = sendFirstAnswer
exports.patchAnswer = patchAnswer
exports.getAnswers = getAnswers
