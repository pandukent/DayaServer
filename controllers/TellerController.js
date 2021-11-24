const TellerModel = require('../models/TellerOfficerModel');
const VaultModel = require("../models/VaultModel");
const DetailCOModel = require("../models/DetailCOModel");
const COModel = require("../models/CommunityOfficerModel");
const { Message, jwt, crypt } = require('../helpers')
const fs = require('fs');
const {
  tellerFilePath,
  historyFilePath,
  detailCOFilePath,
  CODataFilePath
} = require('../JSONFile')


class TellerController {
  static readFile(pathToRead) {
    return new Promise((resolve, reject) => {
      fs.readFile(pathToRead, 'utf-8', (err, data) => {
        if (!err) {
          resolve(JSON.parse(data))
        } else {
          reject(
            err
          )
        }
      })
    })
  }

  static generateFromJSON(req, res, next) {
    let resultFromReadFile = []
    const multipleJSONFile = [
    TellerController.readFile(tellerFilePath),
    TellerController.readFile(historyFilePath),
    TellerController.readFile(detailCOFilePath),
    TellerController.readFile(CODataFilePath)
    ]
    Promise.all(multipleJSONFile)
      .then(result => {
        resultFromReadFile = result;
        TellerModel.create(resultFromReadFile[0])
      })
      .then(() => {
        VaultModel.insertMany(resultFromReadFile[1])
      }).then(() => {
        DetailCOModel.insertMany(resultFromReadFile[2])
      }).then(() => {
        COModel.insertMany(resultFromReadFile[3])
      })
      .then(() => {
        res.status(201).json({
          status: "success",
          message: "Data is successfuly generated from JSON File"
        })
      })
      .catch(next)
  }

  static loginTeller(teller, res, next) {
    TellerModel.findOne({ nik: teller.nik })
      .then((user) => {
        if (!user) {
          throw Message.USER_NOT_FOUND;
        } else {
          if (crypt.checkPassword(teller.password, user.password)) {
            let signTeller = {
              _id: user._id,
              nik: user.nik,
              name: user.name,
              photo: user.photo
            }
            let token = jwt.sign(signTeller)
            res.status(200).json({
              status: "success",
              message: "User found",
              access_token: token,
              data: signTeller
            })
          } else {
            throw Message.INVALID_NIK_PASSWORD;
          }
        }
      })
      .catch(next)
  }

}
module.exports = TellerController