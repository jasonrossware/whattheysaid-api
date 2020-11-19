require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')

require("@babel/core").transform("code", {
  presets: ["@babel/preset-env"],
});

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.use(express.json())
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const personsRouter = require('./routes/persons')
const articlesRouter = require('./routes/articles')

app.use('/persons', personsRouter)
app.use('/articles', articlesRouter)

app.listen(8081, () => console.log('server started'))