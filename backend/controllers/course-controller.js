const HttpError = require('../util/http-error')
const { validationResult } = require('express-validator')
const Course = require('../models/Course')
const Professor = require('../models/Professor')
const Student = require('../models/Student')

const getCourses = async (req, res, next) => {
  try {
    let user = await Professor.findById(req.userData.userId)
    if (!user) {
      user = await Student.findById(req.userData.userId)

      const courses = await Course.find({ _id: { $in: user.course } })
      console.log(user)
      if (courses.length === 0) {
        return res.status(204).json({ success: true, data: courses })
      }
  
      res.status(200).json({
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

const createCourse = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
      )
    }
    const prof = await Professor.findById(req.userData.userId) 
    if (!prof)
      return next(
        new HttpError('No prof found', 403) //// SHOULD BE AN ADMIN LATER ON!
      )

    const course = await Course.create(req.body)

    res.status(201).json({
      success: true,
      data: course,
    })
  } catch (err) {
    next(err)
  }
}

exports.createCourse = createCourse
exports.getCourses = getCourses
