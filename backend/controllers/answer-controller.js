const HttpError = require('../util/http-error')
const { validationResult } = require('express-validator')
const Student = require('../models/Student')
const Course = require('../models/Course')
const Answer = require('../models/Answer')
const Quiz = require('../models/Quiz')

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

    if (!quizTaken) {
      return next(
        new HttpError(`The quiz with the ID ${quiz} does not exist`, 400)
      )
    }

    let now = new Date()
    now.setHours(now.getHours() + 3)

    if (new Date(quizTaken.endDate).getTime() < now) {
      return next(new HttpError('Time expired!', 403))
    }

    const publishedAnswer = await Answer.findOne({ quiz: quizTaken })

    if (publishedAnswer) {
      if (publishedAnswer.student === req.userData.userId) {
        return next(
          new HttpError(
            `The student with the ID ${req.userData.userId} has already sent an answer`,
            400
          )
        )
      }
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

    let now = new Date()
    now.setHours(now.getHours() + 3)

    if (new Date(quizTaken.endDate).getTime() < now) {
      return next(new HttpError('Time expired!', 403))
    }

    let publishedAnswer = await Answer.findOne({
      quiz: quizTaken,
      student: student._id,
    })

    if (!publishedAnswer) {
      return next(
        new HttpError('Can only add answers to your own answers', 403)
      )
    }

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
    console.log(newAnswers)
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

const getAnswersForStats = async (req, res, next) => {
  try {
    const student = await Student.findById(req.userData.userId)

    const allAnswers = await Answer.find({ student: student._id })

    let now = new Date()
    now.setHours(now.getHours() + 3)

    let allQuizzes = []
    for (let index = 0; index < allAnswers.length; index++) {
      allQuizzes.push(await Quiz.findById(allAnswers[index].quiz))
    }

    let quiz = []
    for (const i of allQuizzes) {
      if (now > i.endDate) quiz.push(i)
    }

    let answers = []
    for (const i of quiz) {
      for (const answer of allAnswers) {
        if (answer.quiz.toString() === i._id.toString()) {
          answers.push(answer)
        }
      }
    }
    console.log(answers)
    let ans = []
    let quizId = []

    answers.forEach((element) => {
      ans.push(element.answers)
      quizId.push(element.quiz)
    })

    if (quiz.length === 0) {
      res.status(200).json({
        success: true,
        data: null,
      })
    } else {
      let tags = []
      let correctAnswers = []

      for (const i of quiz) {
        let tagsPerQuiz = []
        let correctAnsPerQuiz = []
        for (const iterator of i.quiz) {
          tagsPerQuiz.push(iterator.tag)
          let answersPerQuestion = []
          for (const k of iterator.answers) {
            if (k.isCorrect) {
              answersPerQuestion.push(k.text)
            }
          }
          correctAnsPerQuiz.push(answersPerQuestion)
        }
        tags.push(tagsPerQuiz)
        correctAnswers.push(correctAnsPerQuiz)
      }

      console.log(tags)
      console.log(correctAnswers)

      let theQuiz = []
      for (let i = 0; i < answers.length; i++) {
        let data = {
          tags: tags[i],
          correctAnswers: correctAnswers[i],
          answers: ans[i],
          quiz: quizId[i],
        }
        theQuiz.push(data)
      }

      res.status(200).json({
        success: true,
        count: answers.length,
        data: { theQuiz },
      })
    }
  } catch (err) {
    next(err)
  }
}

const getAnswers = async (req, res, next) => {
  try {
    const student = await Student.findById(req.userData.userId)

    const answers = await Answer.find({ student: student._id })

    let course = []
    for (const iterator of answers) {
      let quiz = await Quiz.findById(iterator.quiz)
      course.push(quiz.course)
    }

    let courseName = []
    for (const iterator of course) {
      const course = await Course.findById(iterator)
      courseName.push(course.title)
    }

    let grades = []
    let quizTitle = []
    let ans = []
    let quizId = []

    answers.forEach((element) => {
      grades.push(element.grade)
      ans.push(element.answers)
      quizId.push(element.quiz)
    })

    let quiz = []
    for (let index = 0; index < answers.length; index++) {
      quiz.push(await Quiz.findById(answers[index].quiz))
      quizTitle.push(quiz[index].title)
    }

    let questions = []
    let tags = []
    let correctAnswers = []

    for (const i of quiz) {
      let questionsPerQuiz = []
      let tagsPerQuiz = []
      let correctAnsPerQuiz = []
      for (const iterator of i.quiz) {
        questionsPerQuiz.push(iterator.question)
        tagsPerQuiz.push(iterator.tag)
        let answersPerQuestion = []
        for (const k of iterator.answers) {
          if (k.isCorrect) {
            answersPerQuestion.push(k.text + ', ')
          }
        }
        correctAnsPerQuiz.push(answersPerQuestion)
      }
      questions.push(questionsPerQuiz)
      tags.push(tagsPerQuiz)
      correctAnswers.push(correctAnsPerQuiz)
    }

    for (let i = 0; i < correctAnswers.length; i++) {
      for (let j = 0; j < correctAnswers[i].length; j++) {
        let lastStr = correctAnswers[i][j][correctAnswers[i][j].length - 1]
        correctAnswers[i][j][correctAnswers[i][j].length - 1] =
          lastStr.slice(0, -2) + '.'
      }
    }

    for (let i = 0; i < answers.length; i++) {
      for (let j = 0; j < answers[i].answers.length; j++) {
        answers[i].answers[j] = answers[i].answers[j].toString() + ', '
        let lastStr = answers[i].answers[j].toString()
        answers[i].answers[j] = lastStr.slice(0, -2) + '.'
      }
    }

    let theQuiz = []
    for (let i = 0; i < answers.length; i++) {
      let data = {
        title: quizTitle[i],
        courseName: courseName[i],
        grades: grades[i],
        questions: questions[i],
        tags: tags[i],
        correctAnswers: correctAnswers[i],
        answers: ans[i],
        quiz: quizId[i],
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

const getAnswerById = async (req, res, next) => {
  try {
    const answer = await Answer.findOne({
      quiz: req.params.id,
      student: req.userData.userId,
    })

    const quiz = await Quiz.findById(req.params.id)

    let now = new Date()
    now.setHours(now.getHours() + 3)

    if (new Date(quiz.endDate).getTime() < now) {
      res.status(200).json({
        success: true,
        data: answer,
      })
    }

    res.status(200).json({
      success: true,
      data: null,
    })
  } catch (err) {
    next(err)
  }
}

const getAnswersForQuiz = async (req, res, next) => {
  try {
    let answer = await Answer.find({
      quiz: req.params.id,
    })
      .select('answers')
      .select('grade')
      .select('student')
    const quiz = await Quiz.findById(req.params.id)

    let points = 0
    for (const quizz of quiz.quiz) {
      for (const i of quizz.answers) {
        points += i.points
      }
    }

    let quizQuestionsAnswers = []
    for (const i of answer) {
      quizQuestionsAnswers.push(i.answers.length)
    }

    let isFinished = []
    for (const i of quizQuestionsAnswers) {
      isFinished.push(i === quiz.quiz.length)
    }

    let isFinishedTime = null
    Date.now() > quiz.endDate
      ? (isFinishedTime = true)
      : (isFinishedTime = false)

    if (isFinishedTime === true) {
      isFinished.fill(true, 0, isFinished.length)
    }

    if (req.userData.userId.toString() !== quiz.creator.toString()) {
      return next(
        new HttpError('Only the creator of the quiz can see the results', 403)
      )
    }

    let students = []
    for (const i of answer) {
      students.push(i.student)
    }

    const student = await Student.find({ _id: { $in: students } })

    let names = []
    for (const i of student) {
      names.push(i.name)
    }

    let studentsArray = []
    for (let i = 0; i < names.length; i++) {
      if (names[i] !== undefined) {
        studentsArray.push(Object.assign({}, new Array(names[i])))
      }
    }

    res.status(200).json({
      success: true,
      data: answer,
      studentsArray,
      quiz: quiz.title,
      points,
      isFinished,
    })
  } catch (err) {
    next(err)
  }
}

const getAnswerByCourse = async (req, res, next) => {
  try {
    const answer = await Answer.find({ student: req.userData.userId })

    const course = await Course.findOne({ title: req.params.title })

    const quiz = await Quiz.find({ course: { $in: course._id } }).select('_id')

    let ids = []
    for (let i of quiz) {
      ids.push(i._id.toString())
    }

    let answeredQuizzes = []
    for (let i of answer) {
      if (ids.includes(i.quiz.toString())) {
        answeredQuizzes.push(i)
      }
    }

    res.status(200).json({
      success: true,
      data: answeredQuizzes,
    })
  } catch (err) {
    next(err)
  }
}

exports.sendFirstAnswer = sendFirstAnswer
exports.patchAnswer = patchAnswer
exports.getAnswers = getAnswers
exports.getAnswerById = getAnswerById
exports.getAnswerByCourse = getAnswerByCourse
exports.getAnswersForQuiz = getAnswersForQuiz
exports.getAnswersForStats = getAnswersForStats
