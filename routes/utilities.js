const express = require('express');
const { assembleUrlParams } = require('../helpers/urlParams');
const router = express.Router()
const fetch = require('node-fetch');
const Person = require('../models/Person');
const Article = require('../models/Article');
const PendingArticle = require('../models/PendingArticle');
const Log = require('../models/Log');
const { decode } = require('html-entities');
const { scrapeSpeechesAndRemarksList, scrapeSpeechOrRemark } = require('../scrapers/whitehousegov');

router.get('/dailyTweetFetch', async (req, res) => {
  try {
    const persons = await Person.find()
    const bearer = 'Bearer ' + process.env.TWITTER_API_BEARER_TOKEN;
    const url = `${process.env.TWITTER_API_BASE_URL}/tweets/search/recent`;
    const options = {
      method: 'GET',
      headers: {
        'Authorization': bearer
      }
    }

    for (let dex = 0; dex < persons.length; dex++) {
      if (!persons[dex].handles.twitter) { continue; }
      const mostRecentTweet = await Article.find({ type: { $eq: 'tweet' }, person_id: { $eq: persons[dex]._id } }).sort({resource_id:-1}).limit(1) // for MAX
      const mostRecentTweetId = mostRecentTweet[0].resource_id;
      let urlParams = {
        'query': `from:${persons[dex].handles.twitter} -is:retweet`,
        'tweet.fields': 'created_at',
      }
      if (mostRecentTweetId) {
        urlParams['since_id'] = mostRecentTweetId;
      }
      const body = assembleUrlParams(urlParams);
      const finalUrl = url + body;
      const response = await fetch(finalUrl, options);
      const data = await response.json();
      const insertables = data.data.map((object) => {
        return {
          type: 'tweet',
          person_id: persons[dex]._id,
          content: decode(object.text),
          date: object.created_at,
          resource_id: object.id,
          source_key: `twitter_@${persons[dex].handles.twitter}`
        }
      })
      await Article.insertMany(insertables);
    }
    res.json({ success: true })

  } catch (err) {
    res.json({ failure: true, err: err })
  }
})

router.get('/dailyWhitehouseSpeechesRemarks', async (req, res) => {
  const speechesRemarksList = await scrapeSpeechesAndRemarksList();
  const mostRecentLog = await Log.findOne({ name: 'whitehouse_speeches_remarks' }).limit(1);

  const needingPulled = speechesRemarksList.filter(item => !mostRecentLog || Date.parse(item.date) > mostRecentLog?.when_ran);

  const insertables = await Promise.all(needingPulled.map(async item => {
    const scraped = await scrapeSpeechOrRemark({ url: item.link })
    return {
      title: scraped.title,
      content: scraped.content,
      type: 'speech',
      date: item.date,
      when_added: new Date,
      last_change: new Date,
      source_key: 'whitehouse_speeches_remarks',
      person_id: '5f8252e35e4f3cf87897dcb9',
    };
  }));

  await PendingArticle.insertMany(insertables)

  if (!mostRecentLog) {
    await Log.insertMany({ name: 'whitehouse_speeches_remarks' });
  } else {
    mostRecentLog.when_ran = new Date;
    await mostRecentLog.save();
  }

  res.json(speechesRemarksList)
})

module.exports = router