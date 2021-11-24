const COModel = require("../models/CommunityOfficerModel");
const DetailCOModel = require("../models/DetailCOModel");
const { Message, jwt, crypt } = require("../helpers");

class COController {
  static registerCO(req, res, next) {
    COModel.create(req.body)
      .then((newCO) => {
        res.status(201).json({
          status: "success",
          message: "Berhasil menambahkan Community Officer",
          data: newCO,
        });
      })
      .catch(next)
  }

  static loginCO(communityOfficer, res, next) {
    COModel.findOne({ nik: communityOfficer.nik })
      .then((user) => {
        if (!user) {
          throw Message.USER_NOT_FOUND;
        } else {
          if (crypt.checkPassword(communityOfficer.password, user.password)) {
            let signCO = {
              _id: user._id,
              nik: user.nik,
              name: user.name,
              region: user.region,
            };
            let token = jwt.sign(signCO);
            res.status(200).json({
              status: "success",
              message: "User Terdaftar",
              access_token: token,
              data: {
                _id: user._id,
                nik: user.nik,
                name: user.name,
                region: user.region,
              },
            });
          } else {
            throw Message.INVALID_NIK_PASSWORD
          }
        }
      })
      .catch(next)
  }

  static getAllCO(req, res, next) {
    COModel.find({})
      .then((allCOData) => {
        res.status(201).json({
          status: "success",
          message: "Berhasil mengambil data",
          data: allCOData,
        });
      })
      .catch(next)
  }


  static getAllDetailCO(req, res, next) {
    DetailCOModel.find({}).sort({status : -1, date: -1 })
      .then(allDetailCO => {
        res.status(201).json({
          status: "success",
          message: "Berhasil mengambil data",
          data: allDetailCO
        })
      })
      .catch(next)
  }

  static getDetailCO(req, res, next) {
    let jmlDibayar = 0;
    let jmlHutang = 0;
    let dataDetail = [""];
    DetailCOModel.find({ communityOfficer: req.params["co_id"], status : "Done" })
      .then(detailCO => {
        detailCO.forEach(function(data) {
          if(data.type === "Payment"){
            jmlDibayar += data.nominal
          } else {
            jmlHutang += data.nominal
          }
        })
        if (detailCO.length > 0 ) dataDetail = detailCO;
        console.log(jmlHutang)
        console.log(jmlDibayar)
          res.status(201).json({
            status: "success",
            message: "Berhasil mengambil data Detail CO",
            dibayar : jmlDibayar,
            hutang : jmlHutang,
            data: dataDetail
          })
      })
      .catch(next)
  }

  static transactionCO(req, res, next) {
    const transactionData = req.body;
    DetailCOModel.create(transactionData)
      .then((data) => {
        res.status(201).json({
          status: "success",
          message: "Berhasil menambahkan data Detail Community Officer",
          data: data,
        });
      })
      .catch(next)
  }
}
module.exports = COController;
