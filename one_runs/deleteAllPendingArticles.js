function runOneTimeFunction() {
  const prompt = require('prompt-sync')();
  const functionToRun = prompt(`What would you like to do? You can: [${['removeAllPendingArticles']}] >>>`);
  if (!functionToRun) {
    console.log('Input blank or invalid');
    return false;
  }
  if (functionToRun ==='removeAllPendingArticles') {
    removeAllPendingArticles()
  }
}

async function removeAllPendingArticles() {
  require('dotenv').config()
  const mongoose = require('mongoose')
  mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })

  const db = mongoose.connection
  db.on('error', (error) => console.error(error))
  db.once('open', () => console.log('connected to database'))

  const PendingArticle = require('../models/PendingArticle');
  PendingArticle.deleteMany({}).then(function() {
    console.log('deleted')
  }).catch(function(err) {
    console.log('failed', err)
  })
}

// removeAllPendingArticles();
runOneTimeFunction();