const mongoose = require('mongoose')

const articleSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  person_id: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: false,
    default: new Date
  },
})

module.exports = mongoose.model('Article', articleSchema, 'articles')