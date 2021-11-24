var express = require("express");
var router = express.Router();
var VaultC = require("../controllers/VaultController.js");
const { authenticate } = require("../middlewares/auth");

router.post('/:idDetailCO',authenticate, function (req, res, next) {
  VaultC.writeVaultHistory(req, res, next);
})

router.get("/", authenticate, function (req, res, next) {
  VaultC.getVaultHistory(req, res, next);
});

router.get('/balance', authenticate, function (req, res, next) {
  VaultC.getCurrentBalance(req, res, next);
});

module.exports = router;
