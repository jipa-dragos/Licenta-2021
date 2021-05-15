const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CourseSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['course', 'lab'], required: true },
  year: { type: String, enum: ['I', 'II', 'III'], required: true },
  semester: { type: String, enum: ['I', 'II'], required: true },
  students: { type: [mongoose.Types.ObjectId], ref: 'Student'},
  accessCode: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Course', CourseSchema)