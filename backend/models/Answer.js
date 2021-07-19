const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AnswerSchema = new Schema({
  answers: { type: [[String]], required: true},
  questionId: { type: [[String]], required: true},
  grade: { type: Number, required: true },
  quiz: { type: mongoose.Types.ObjectId, required: true, ref: 'Quiz'},
  student: { type: mongoose.Types.ObjectId, required: true, ref: 'Student'},
  createdAt: { type: Date, default: Date.now },
})

// Prevent student from submitting more than 1 answer for quiz
AnswerSchema.index({ quiz: 1, student: 1}, { unique: true})

module.exports = mongoose.model('Answer', AnswerSchema)
