const express = require('express')
const router = express.Router()
const Person = require('../models/Person')

// get all persons
router.get('/', async (req, res) => {
  try {
    const persons = await Person.find()
    res.json(persons)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// add a person
router.post('/', async (req, res) => {
  const person = new Person({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
  })
  try {
    const newPerson = await person.save()
    res.status(201).json(newPerson)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

module.exports = router
