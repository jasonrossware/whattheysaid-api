// require('dotenv').config()

const serverless = require('serverless-http');

const express = require('express')
const app = express()
const mongoose = require('mongoose')
var cors = require('cors')

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('connected to database'))

app.use(express.json())

app.use(cors())

const personsRouter = require('./routes/persons')
const articlesRouter = require('./routes/articles')
const utilitiesRouter = require('./routes/utilities')

app.use('/persons', personsRouter)
app.use('/articles', articlesRouter)
app.use('/utilities', utilitiesRouter)

// app.listen(8081, () => console.log('server started'))

module.exports.handler = serverless(app);