const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema

const StudentSchema = new Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^[a-zA-Z0-9_.+-]+@(?:(?:[a-zA-Z0-9-]+\.)?[a-zA-Z]+\.)?(stud.ase)\.ro$/,
      'Please add a valid email',
    ],
  },
  password: { type: String, required: true, minlength: 6 },
  faculty: { type: String, required: true },
  series: { type: String, required: true },
  year: { type: String, enum: ['I', 'II', 'III'], required: true },
  group: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
})

StudentSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Student', StudentSchema)
