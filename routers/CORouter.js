let mongoose = require('mongoose');
var express = require('express');
var router = express.Router()
var COController = require('../controllers/COController.js');
const { authenticate } = require('../middlewares/auth');

router.post("/register", authenticate, function (req, res, next) {
  COController.registerCO(req, res, next);
});

router.post("/login", function (req, res, next) {
  let communityOfficer = req.body;
  COController.loginCO(communityOfficer, res, next);
});

router.get('/', authenticate, function (req, res, next) {
  COController.getAllCO(req, res, next);
});

router.get('/detail/', authenticate, function (req, res, next) {
  COController.getAllDetailCO(req, res, next);
})

router.get('/detail/:co_id', authenticate, function (req, res, next) {
  COController.getDetailCO(req, res, next);
})

router.post('/transaction', authenticate, function (req, res, next) {
  COController.transactionCO(req, res, next);
});

module.exports = router
