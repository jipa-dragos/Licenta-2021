const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AnswerSchema = new Schema({
  answers: { type: [String], required: true},
  grade: { type: Number, required: true },
  quiz: { type: mongoose.Types.ObjectId, required: true, ref: 'Quiz'},
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Answer', AnswerSchema)
