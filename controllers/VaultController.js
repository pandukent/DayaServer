const VaultModel = require("../models/VaultModel");
const DetailCOModel = require("../models/DetailCOModel");
let mongoose = require("mongoose");

class VaultController {
  static currentBalance = 0;

  static getCurrentBalance(req, res, next) {
    VaultModel.findOne({}).sort({ date: -1 })
      .then(latest => {
        VaultController.currentBalance = latest.balance
        console.log(VaultController.currentBalance)
        res.status(200).json({
          status: "success",
          message: "Berhasil mengambil data",
          data: (latest.balance).toLocaleString("id-ID", { style: "currency", currency: "IDR" })
        })
      })
      .catch(next)
  }

  static getVaultHistory(req, res, next) {
    VaultModel.find({}).sort({ date: -1 })
      .then(latest => {
        
        VaultController.currentBalance = latest.balance
    console.log(VaultController.currentBalance)

        res.status(200).json({
          status: "success",
          message: "Berhasil mengambil data",
          data: latest,
        });
      })
      .catch(next)
  }

  static writeVaultHistory(req, res, next) {
    console.log(VaultController.currentBalance)
    let detailId = mongoose.Types.ObjectId(req.params["idDetailCO"])
    DetailCOModel.findOneAndUpdate({_id : detailId}, {status: "Done"})
      .then(detail => {
        return VaultModel.create({
          teller: req.user.nik,
          type: detail.type,
          nominal: detail.nominal,
          balance: (detail.type === "Payment") ? (VaultController.currentBalance += detail.nominal) : (VaultController.currentBalance -= detail.nominal)
        })
      })
      .then(result => {
        VaultController.currentBalance = result.balance
        // console.log("current Rp. " + VaultController.currentBalance)
        res.status(201).json({
          status: "success",
          message: "Berhasil menulis data",
          data: result,
        });
      })
      .catch(next)

  }
}
module.exports = VaultController;
