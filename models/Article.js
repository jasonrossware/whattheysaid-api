const mongoose = require('mongoose')

const articleSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: false,
  },
  person_id: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  content_array: {
    type: Array,
    required: false,
  },
  date: {
    type: Date,
    required: false,
    default: new Date
  },
  when_added: {
    type: Date,
    required: false,
    default: new Date,
  },
  last_change: {
    type: Date,
    required: false,
    default: new Date,
  },
  source_key: {
    type: String,
    required: true,
  },
  resource_id: {
    type: String,
    required: false
  }
})

module.exports = mongoose.model('Article', articleSchema, 'articles')