const mongoose = require('mongoose')

const logSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  person_id: {
    type: String,
    required: false,
  },
  when_ran: {
    type: Date,
    required: true,
    default: new Date
  },
})

module.exports = mongoose.model('Log', logSchema, 'logs')