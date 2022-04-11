const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  handles: {
    type: Object,
    required: false,
  }
})

module.exports = mongoose.model('Person', personSchema, 'persons')