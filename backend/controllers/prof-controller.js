const HttpError = require('../util/http-error')
const { validationResult } = require('express-validator')
const Professor = require('../models/Professor')
const Course = require('../models/Course')

const updateProfessor = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.log(errors)
      return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
      )
    }

    const course = await Course.findOne({ title: req.body.courseName })

    const professor = await Professor.findByIdAndUpdate({_id: req.params.pid}, { $addToSet: {course: course.id} }, {new: true} )
    // const professor = await Professor.findById(req.params.pid)
    // professor.course.addToSet(course.id)

    res.status(200).json({
        success: true,
        data: professor
    })
  } catch (err) {
    next(err)
  }
}

exports.updateProfessor = updateProfessor
