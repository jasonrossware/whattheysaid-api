const express = require('express');
const router = express.Router()
const Article = require('../models/Article')
const forms = require('../helpers/forms');

// get all articles with phrase = ?
router.get('/articlesByPhrase', async (req, res) => {
  const { person_id, phrase, all_forms } = req.query;
  var regExp;
  if (all_forms === 'true') {
    const { suffixes } = forms;
    const suffixInserts = suffixes.join('|');
    regExp = String.raw`\b${phrase}(?:${suffixInserts})?\b`
  } else {
    regExp = String.raw`\b${phrase}\b`
  }
  try {
    const articles = await Article.find({
      person_id,
      content: { $regex: regExp, $options: 'gi' },
    })
    res.json(articles)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})


// get all articles
router.get('/articlesByPhrase2', async (req, res) => {
  try {
    const possibilities = supplyAllForms('gun');
    res.json(possibilities)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// add an article
router.post('/', async (req, res) => {
  const article = new Article({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
  })
  try {
    const newArticle = await article.save()
    res.status(201).json(newArticle)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

module.exports = router
