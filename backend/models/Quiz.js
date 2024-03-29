const mongoose = require('mongoose')
const Schema = mongoose.Schema

const QuizSchema = new Schema({
  title: { type: String, required: true },
  quiz: [
    {
      question: { type: String, required: true },
      tag: { type: String, required: true },
      answers: [
        {
          text: {
            type: String,
            required: true,
          },
          isCorrect: {
            type: Boolean,
            required: true,
            default: false,
          },
          points: {
            type: Number,
            required: false,
          },
        },
      ],
      feedback: { type: String, required: false, default: 'no feedback' },
    },
  ],
  accessCode: { type: String, required: true, unique: true },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: 'Professor' },
  course: { type: mongoose.Types.ObjectId, required: true, ref: 'Course' },
  startDate: { type: Date, min: Date.now, required: true },
  endDate: { type: Date, min: Date.now, required: true },
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Quiz', QuizSchema)
