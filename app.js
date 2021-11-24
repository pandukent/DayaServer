let mongoose = require('mongoose');
const express = require('express')
require("dotenv").config();

const app = express()

const cors = require('cors');
app.use(cors());
app.use(express.json())

app.use(express.urlencoded({ extended: false }))

var mongoDB = process.env.URI_MONGODB

if (process.env.NODE_ENV === 'test') {
  mongoDB = process.env.URI_MONGODB_TEST
}


mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

const { errorHandler } = require('./helpers');
const TellerRouter = require('./routers/TellerOfficerRouter')
const VaultRouter = require('./routers/VaultRouter')
const CORouter = require('./routers/CORouter')


//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use('/teller', TellerRouter);
app.use('/communityofficer', CORouter);
app.use('/vault', VaultRouter);

app.use(errorHandler.errorHandler);

module.exports = app



