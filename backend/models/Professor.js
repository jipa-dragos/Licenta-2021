const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema

const ProfessorSchema = new Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^[a-zA-Z0-9_.+-]+@(?:(?:[a-zA-Z0-9-]+\.)?[a-zA-Z]+\.)?(ase)\.ro$/,
      'Please add a valid email'
    ]
  },
  password: { type: String, required: true, minlength: 6 },
  faculty: { type: String, required: true },
  course: { type: [mongoose.Types.ObjectId], ref: 'Course'},
  createdAt: { type: Date, default: Date.now }
})

ProfessorSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Professor', ProfessorSchema)