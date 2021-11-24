let mongoose = require('mongoose');
var express = require('express');
var router = express.Router()
var TellerC = require('../controllers/TellerController.js');

router.post('/generateJSON', function (req, res, next) {
  TellerC.generateFromJSON(req, res, next);
})

router.post('/login', function (req, res, next) {
  let teller = req.body
  TellerC.loginTeller(teller, res, next);
})



module.exports = router