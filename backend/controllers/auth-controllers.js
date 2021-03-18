const Student = require('../models/Student')
const Professor = require('../models/Professor')
const HttpError = require('../util/http-error')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')

const getMe = async (req, res, next) => {
  try {
    const user = await Student.findById(req.userData.userId) || await Professor.findById(req.userData.userId)

    res.status(200).json({
      success: true,
      data: user
    })
  } catch (err) {
    next(err)
  }
}

const studentSignup = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    console.log(errors)
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 403)
    )
  }

  const { name, email, password, faculty, series, year, group } = req.body

  let existingStudent
  try {
    existingStudent = await Student.findOne({ email: email })
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    )
    return next(error)
  }

  if (existingStudent) {
    const error = new HttpError(
      'Student exists already, please login instead.',
      422
    )
    return next(error)
  }

  let hashedPassword
  try {
    hashedPassword = await bcrypt.hash(password, 12)
  } catch (err) {
    const error = new HttpError('Couldnnot create student, pls try again', 500)
    return next(error)
  }

  const createdStudent = new Student({
    name,
    email,
    password: hashedPassword,
    faculty,
    series,
    year,
    group
  })

  let token
  try {
    token = jwt.sign(
      { studentId: createdStudent.id, email: createdStudent.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )
  } catch (err) {
    const error = new HttpError('Couldnnot create Student why, pls try again', 500)
    return next(error)
  }

  try {
    await createdStudent.save()
  } catch (err) {
    const error = new HttpError('Signing up failed, please try again.', 500)
    return next(error)
  }

  res
    .status(201)
    .json({ studentId: createdStudent.id, email: createdStudent.email, token: token })
}

const studentLogin = async (req, res, next) => {
  const { email, password } = req.body

  let existingStudent
  try {
    existingStudent = await Student.findOne({ email: email })
  } catch (err) {
    const error = new HttpError(
      'Logged in failed, please try again later.',
      500
    )
    return next(error)
  }

  if (!existingStudent) {
    const error = new HttpError('Invalid, credentials, couldnt log u in', 401)
    return next(error)
  }

  let isValidPassword = false
  try {
    isValidPassword = await bcrypt.compare(password, existingStudent.password)
  } catch (err) {
    const error = new HttpError(
      'Could not log you in, pls check your credentials',
      500
    )
    return next(error)
  }

  if (!isValidPassword) {
    const error = new HttpError(
      'Invalid credentials, could not log you in',
      403
    )
    return next(error)
  }

  let token
  try {
    token = jwt.sign(
      { studentId: existingStudent.id, email: existingStudent.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )
  } catch (err) {
    const error = new HttpError('Couldnnot login student, pls try again', 500)
    return next(error)
  }

  res.json({
    studentId: existingStudent.id,
    email: existingStudent.email,
    token: token
  })
}

const professorSignup = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    console.log(errors)
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 403)
    )
  }

  const { name, email, password, faculty } = req.body
  const role = 'prof'
  let existingProfessor
  try {
    existingProfessor = await Professor.findOne({ email: email })
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    )
    return next(error)
  }

  if (existingProfessor) {
    const error = new HttpError(
      'Professor exists already, please login instead.',
      422
    )
    return next(error)
  }

  let hashedPassword
  try {
    hashedPassword = await bcrypt.hash(password, 12)
  } catch (err) {
    const error = new HttpError('Couldnnot create professor, pls try again', 500)
    return next(error)
  }

  const createdProfessor = new Professor({
    name,
    email,
    password: hashedPassword,
    faculty,
    role
  })

  let token
  try {
    token = jwt.sign(
      { professorId: createdProfessor.id, email: createdProfessor.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )
  } catch (err) {
    const error = new HttpError('Couldnnot create Professor why, pls try again', 500)
    return next(error)
  }

  try {
    await createdProfessor.save()
  } catch (err) {
    const error = new HttpError('Signing up failed, please try again.', 500)
    return next(error)
  }

  res
    .status(201)
    .json({ professorId: createdProfessor.id, email: createdProfessor.email, token: token })
}

const professorLogin = async (req, res, next) => {
  const { email, password } = req.body

  let existingProfessor
  try {
    existingProfessor = await Professor.findOne({ email: email })
  } catch (err) {
    const error = new HttpError(
      'Logged in failed, please try again later.',
      500
    )
    return next(error)
  }

  if (!existingProfessor) {
    const error = new HttpError('Invalid credentials, could not log you in!', 401)
    return next(error)
  }

  let isValidPassword = false
  try {
    isValidPassword = await bcrypt.compare(password, existingProfessor.password)
  } catch (err) {
    const error = new HttpError(
      'Could not log you in, pls check your credentials',
      500
    )
    return next(error)
  }

  if (!isValidPassword) {
    const error = new HttpError(
      'Invalid credentials, could not log you in',
      403
    )
    return next(error)
  }

  let token
  try {
    token = jwt.sign(
      { professorId: existingProfessor.id, email: existingProfessor.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )
  } catch (err) {
    const error = new HttpError('Could not login Prexisting Professor, pls try again', 500)
    return next(error)
  }

  res.json({
    professorId: existingProfessor.id,
    email: existingProfessor.email,
    token: token,
    role: existingProfessor.role
  })
}

exports.studentSignup = studentSignup
exports.studentLogin = studentLogin
exports.professorSignup = professorSignup
exports.professorLogin = professorLogin
exports.getMe = getMe