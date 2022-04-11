const express = require('express');
const router = express.Router()
const Article = require('../models/Article')
const forms = require('../helpers/forms');
const PendingArticle = require('../models/PendingArticle');

// get all articles with phrase = ?
router.get('/articlesByPhrase', async (req, res) => {
  const { person_id, phrase, all_forms, sort, source } = req.query;
  var regExp;
  if (all_forms === 'true') {
    const { suffixes } = forms;
    const suffixInserts = suffixes.join('|');
    regExp = String.raw`\b${phrase}(?:${suffixInserts})?\b`
  } else {
    regExp = String.raw`\b${phrase}\b`
  }
  try {
    const typesSearched = await Article.aggregate([
      { $match: { person_id: person_id } },
      { $group: { _id: "$type", count: { $sum: 1 } } }
    ]);
    const sourceArray = () => {
      if (source === 'everything') {
        return ['speech', 'tweet', 'interview', 'statement'];
      }
      if (source === 'tweets') {
        return ['tweet'];
      }
      if (source === 'no_tweets') {
        return ['speech', 'interview', 'statement'];
      }
    }
    const sortNumber = sort === 'newest' ? -1 : 1;
    const sortObject = { date: sortNumber };
    if (sort === 'newest') {
      var articles = await Article.find({
        person_id,
        content: { $regex: regExp, $options: 'gi' },
        type: { $in: sourceArray() },
      }).sort(sortObject)
    } else {
      var articles = await Article.find({
        person_id,
        content: { $regex: regExp, $options: 'gi' },
        type: { $in: sourceArray() },
      }).sort(sortObject)
    }
    res.json({
      articles,
      typesSearched
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: err.message })
  }
})

// get article by id
router.get('/articleById', async (req, res) => {
  const { article_id } = req.query;
  try {
    const article = await Article.findOne({
      _id: article_id
    })
    res.json(article)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})


// add an article
router.get('/createArticle', async (req, res) => {
  const { type, person_id, content, date, resource_id } = req.query;
  const article = new Article({
    type,
    person_id,
    content,
    date,
    resource_id,
  })
  try {
    const newArticle = await article.save()
    res.status(201).json(newArticle)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// get pending articles
router.get('/pendingArticles', async (req, res) => {
  // const { article_id } = req.query;
  try {
    const articles = await PendingArticle.find()
    res.json(articles)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/updatePendingArticle', async (req, res) => {
  // const person = new Person({
  //   first_name: req.body.first_name,
  //   last_name: req.body.last_name,
  // })
  const { article_id, content_array } = req.body;
  console.log('stuff')
  console.log(article_id, content_array);
  try {
    const pendingArticleUpdate = await PendingArticle.findOneAndUpdate({ _id: article_id }, { content_array: content_array })
    res.status(201).json(pendingArticleUpdate)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

module.exports = router
