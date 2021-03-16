const HttpError = require('../util/http-error')
const { validationResult } = require('express-validator')
const Quiz = require('../models/Quiz')
const Professor = require('../models/Professor')
const Student = require('../models/Student')
const Course = require('../models/Course')

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

    console.log(course)

    if (!prof.course.includes(course._id)) {
      return next(
        new HttpError(
          'Invalid Course Name. Please select a course that you have access to!',
          403
        )
      )
    }

    const quizz = await Quiz.create({
      title,
      quiz,
      creator: prof._id,
      course,
      startDate,
      endDate,
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
    let quiz = await Quiz.findById(req.params.id)

    if (!quiz) {
      return next(
        new HttpError(`projects not found with id of ${req.params.id}`, 404)
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
    console.log(req)
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

    res.status(200).json({
      success: true,
      count: quizzes.length,
      data: quizzes,
    })
  } catch (err) {
    next(err)
  }
}

exports.createQuiz = createQuiz
exports.deleteQuiz = deleteQuiz
exports.getQuizzesForStudent = getQuizzesForStudent
exports.getQuizzesForProf = getQuizzesForProf
exports.getAllQuizzes = getAllQuizzes
exports.getQuizzesForCourse = getQuizzesForCourse
