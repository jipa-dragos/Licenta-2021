const HttpError = require('../util/http-error')
const { validationResult } = require('express-validator')
const Course = require('../models/Course')
const Quiz = require('../models/Quiz')
const Professor = require('../models/Professor')
const Student = require('../models/Student')
const Answer = require('../models/Answer')

const getCourses = async (req, res, next) => {
  try {
    let user = await Professor.findById(req.userData.userId)
    if (!user) {
      user = await Student.findById(req.userData.userId)

      // const courses = await Course.find({ year: { $in: user.year } })
      // if (courses.length === 0) {
      //   return res.status(204).json({ success: true, data: courses })
      // }
      const courses = await Course.find({ students: { $in: user._id }})

      for (const i of courses) {
        console.log(i.students)
      }

      return res.status(200).json({
        success: true,
        count: courses.length,
        data: courses,
      })
    }

    const courses = await Course.find({ _id: { $in: user.course } })

    if (courses.length === 0) {
      return res.status(204).json({ success: true, data: courses })
    }

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    })
  } catch (err) {
    next(err)
  }
}

const getCourseByTitle = async (req, res, next) => {
  try {
    const course = await Course.findOne({ title: req.params.title })

    const quiz = await Quiz.find({ course: { $in: course._id } })
      .select('_id')
      .select('title')
      .select('startDate')

    res.status(200).json({
      success: true,
      data: course,
      quiz,
    })
  } catch (err) {
    next(err)
  }
}

const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
    res.status(200).json({
      success: true,
      data: course,
    })
  } catch (err) {
    next(err)
  }
}

const getCourseByAccessCode = async (req, res, next) => {
  try {
    const course = await Course.findOne({ accessCode: req.params.id })

    const student = await Student.findById(req.userData.userId)
    if (!student) {
      return next(
        new HttpError(
          `User ${req.userData.userId} cannot access the Course`,
          403
        )
      )
    }

    res.status(200).json({
      success: true,
      data: course,
    })
  } catch (err) {
    next(err)
  }
}

const createCourse = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
      )
    }

    const prof = await Professor.findById(req.userData.userId)
    if (!prof) return next(new HttpError('No prof found', 403))

    const { title, description, type, year, semester } = req.body
    const { v4: uuidv4 } = require('uuid')

    const accessCode =
      title + '-' + type + '-' + uuidv4().toString('base64').substring(0, 8)

    const course = await Course.create({
      title,
      description,
      type,
      year,
      accessCode,
      semester,
    })

    await Professor.findByIdAndUpdate(
      { _id: req.userData.userId },
      { $addToSet: { course: course.id } },
      { new: true }
    )

    res.status(201).json({
      success: true,
      data: course,
    })
  } catch (err) {
    next(err)
  }
}

const updateCourse = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
      )
    }

    const prof = await Professor.findById(req.userData.userId)
    if (!prof) return next(new HttpError('No prof found', 403))

    let course = await Course.findById(req.params.id)

    if (!prof.course.includes(course._id)) {
      return next(
        new HttpError('Only the creator of the course can update it!', 403)
      )
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(201).json({
      success: true,
      data: course,
    })
  } catch (err) {
    next(err)
  }
}

const joinCourse = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
      )
    }

    const stud = await Student.findById(req.userData.userId)
    if (!stud) return next(new HttpError('No student found', 403))

    const { accessCode } = req.body

    const courseFound = await Course.findOne({ accessCode: accessCode })
    
    let set = new Set()
    for (const i of courseFound.students) {
      set.add(i.toString())
    }
    set.add(req.userData.userId)

    const fieldToUpdate = {
      students: Array.from(set)
    }

    console.log(fieldToUpdate)
    const course = await Course.findByIdAndUpdate(courseFound._id, fieldToUpdate, {
      new: true,
      runValidators: true,
    })

    res.status(201).json({
      success: true,
      data: course,
    })
  } catch (err) {
    next(err)
  }
}

const deleteCourse = async (req, res, next) => {
  try {
    let prof = await Professor.findById(req.userData.userId)
    if (!prof) {
      return next(
        new HttpError(
          `The user with the id:  ${req.params.id} is not a professor`,
          404
        )
      )
    }

    const course = await Course.findById(req.params.id)

    if (!course) {
      return next(
        new HttpError(`course not found with id of ${req.params.id}`, 404)
      )
    }

    if (!prof.course.includes(course._id)) {
      return next(
        new HttpError(
          `Professor ${req.userData.userId} is not authorized to delete this quiz`,
          401
        )
      )
    }

    const quiz = await Quiz.find({ course: req.params.id })
    let quizIds = []
    for (let i = 0; i < quiz.length; i++) {
      quizIds.push(quiz[i]._id)
    }

    await Answer.find({ quiz: { $in: quizIds } }).deleteMany()
    await Quiz.find({ course: req.params.id }).deleteMany()
    await Course.findByIdAndDelete(req.params.id)

    for (const i of prof.course) {
      if (i.toString() === req.params.id.toString()) {
        await Professor.update(
          { _id: req.userData.userId },
          { $pull: { course: i }}
        )
      }
    }

    res.status(200).json({
      success: true,
      data: {},
    })
  } catch (err) {
    next(err)
  }
}

exports.createCourse = createCourse
exports.updateCourse = updateCourse
exports.joinCourse = joinCourse
exports.deleteCourse = deleteCourse
exports.getCourses = getCourses
exports.getCourseByTitle = getCourseByTitle
exports.getCourseById = getCourseById
exports.getCourseByAccessCode = getCourseByAccessCode
