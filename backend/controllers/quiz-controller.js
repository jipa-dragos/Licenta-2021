const HttpError = require('../util/http-error')
const { validationResult } = require('express-validator')
const Quiz = require('../models/Quiz')
const Professor = require('../models/Professor')
const Student = require('../models/Student')
const Course = require('../models/Course')
const Answer = require('../models/Answer')

const createQuiz = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
      )
    }

    const creator = req.userData.userId

    const prof = await Professor.findById(creator)
    if (!prof) {
      return next(new HttpError('Only a professor can create quizzes!', 403))
    }

    const { title, quiz, startDate, endDate, courseName } = req.body

    const course = await Course.findOne({ title: courseName })

    if (!prof.course.includes(course._id)) {
      return next(
        new HttpError(
          'Invalid Course Name. Please select a course that you have access to!',
          403
        )
      )
    }

    const { v4: uuidv4 } = require('uuid')
    const accessCode =
      courseName + '-' + uuidv4().toString('base64').substring(0, 8)

    const quizz = await Quiz.create({
      title,
      quiz,
      creator: prof._id,
      course,
      accessCode,
      startDate,
      endDate,
    })

    console.log(quizz)

    res.status(201).json({
      success: true,
      data: quizz,
    })
  } catch (err) {
    next(err)
  }
}

const updateQuiz = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
      )
    }

    const creator = req.userData.userId

    const prof = await Professor.findById(creator)
    if (!prof) {
      return next(new HttpError('Only a professor can update quizzes!', 403))
    }

    let quizz = await Quiz.findById(req.params.id)

    if (quizz.creator.toString() !== prof._id.toString()) {
      return next(
        new HttpError('Only the creator of the quiz can update it!', 403)
      )
    }

    quizz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(201).json({
      success: true,
      data: quizz,
    })
  } catch (err) {
    next(err)
  }
}

const deleteQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id)

    if (!quiz) {
      return next(
        new HttpError(`quiz not found with id of ${req.params.id}`, 404)
      )
    }

    if (quiz.creator.toString() !== req.userData.userId) {
      return next(
        new HttpError(
          `User ${req.userData.userId} is not authorized to delete this quiz`,
          401
        )
      )
    }

    await Answer.find({ quiz: req.params.id }).deleteMany()
    await Quiz.findByIdAndDelete(req.params.id)

    res.status(200).json({ success: true, data: {} })
  } catch (err) {
    next(err)
  }
}

const getQuizzesForCourse = async (req, res, next) => {
  try {
    const quiz = await Quiz.find({ course: req.params.id })
    res.status(200).json({ success: true, count: quiz.length, data: quiz })
  } catch (err) {
    next(err)
  }
}

const getQuizzesForStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.userData.userId)
    const quizzes = await Quiz.find()
    let prof
    for (let i = 0; i < quizzes.length; i++)
      prof = await Professor.find({ _id: { $in: quizzes[i].creator } })
    console.log(prof[0])
    if (student.faculty === prof[0].faculty) {
      console.log('Same Fasculty?')
    }
    // UNFINISHED BUSINESS
    // UNFINISHED BUSINESS
    // UNFINISHED BUSINESS
    // UNFINISHED BUSINESS
    // UNFINISHED BUSINESS
    // UNFINISHED BUSINESS
    // UNFINISHED BUSINESS
    // UNFINISHED BUSINESS
    // UNFINISHED BUSINESS
    // UNFINISHED BUSINESS
    // UNFINISHED BUSINESS
    res.status(200).json({
      success: true,
      count: quizzes.length,
      data: quizzes,
    })
  } catch (err) {
    next(err)
  }
}

const getQuizzesForProf = async (req, res, next) => {
  try {
    const prof = await Professor.findById(req.userData.userId)

    console.log(prof._id)

    const quizzes = await Quiz.find({ creator: req.userData.userId })

    if (quizzes.length === 0) {
      return res.status(204).json({ success: true, data: quizzes })
    }

    res.status(200).json({
      success: true,
      count: quizzes.length,
      data: quizzes,
    })
  } catch (err) {
    next(err)
  }
}

const getAllQuizzes = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find()

    if (quizzes.length === 0) {
      return res.status(204).json({ success: true, data: quizzes })
    }

    let quizCreator = []
    for (let i = 0; i < quizzes.length; i++) {
      quizCreator.push(quizzes[i].creator)
    }

    console.log(quizCreator)
    console.log(req.userData.userId)

    if (quizCreator.includes(req.userData.userId)) {
      console.log('nu e eroare')
    }

    res.status(200).json({
      success: true,
      count: quizzes.length,
      data: quizzes,
    })
  } catch (err) {
    next(err)
  }
}

const getQuizById = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .select('-quiz.answers.points')
      .select('-quiz.answers.isCorrect')

    const answer = await Answer.find({ student: req.userData.userId })

    for (const i of answer) {
      if (i.quiz.toString() === quiz._id.toString()) {
        return next(
          new HttpError(
            `Student ${req.userData.userId} Already answered this quiz`,
            403
          )
        )
      }
    }

    if (new Date(quiz.startDate).getTime() > Date.now()) {
      return next(
        new HttpError(
          `User ${req.userData.userId} is too early to start the quiz`,
          403
        )
      )
    }

    if (new Date(quiz.endDate).getTime() < Date.now()) {
      return next(new HttpError(`Time expired for the quiz`, 403))
    }

    res.status(200).json({
      success: true,
      data: quiz,
    })
  } catch (err) {
    next(err)
  }
}

const getQuizByAccessCode = async (req, res, next) => {
  try {
    const quiz = await Quiz.findOne({ accessCode: req.params.id })
      .select('-quiz.answers.points')
      .select('-quiz.answers.isCorrect')

    const student = await Student.findById(req.userData.userId)
    if (!student) {
      return next(
        new HttpError(`User ${req.userData.userId} cannot access the Quiz`, 403)
      )
    }

    const answer = await Answer.find({ student: student._id })

    for (const i of answer) {
      if (i.quiz.toString() === quiz._id.toString()) {
        return next(
          new HttpError(
            `Student ${req.userData.userId} Already answered this quiz`,
            403
          )
        )
      }
    }

    if (new Date(quiz.startDate).getTime() > Date.now()) {
      return next(
        new HttpError(
          `User ${req.userData.userId} is too early to start the quiz`,
          403
        )
      )
    }

    if (new Date(quiz.endDate).getTime() < Date.now()) {
      return next(new HttpError(`Time expired for the quiz`, 403))
    }

    res.status(200).json({
      success: true,
      data: quiz,
    })
  } catch (err) {
    next(err)
  }
}

exports.createQuiz = createQuiz
exports.updateQuiz = updateQuiz
exports.deleteQuiz = deleteQuiz
exports.getQuizzesForStudent = getQuizzesForStudent
exports.getQuizzesForProf = getQuizzesForProf
exports.getAllQuizzes = getAllQuizzes
exports.getQuizzesForCourse = getQuizzesForCourse
exports.getQuizById = getQuizById
exports.getQuizByAccessCode = getQuizByAccessCode
