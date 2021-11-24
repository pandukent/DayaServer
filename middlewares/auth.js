const { Message, jwt } = require('../helpers')
const TellerModel = require('../models/TellerOfficerModel')

module.exports = {
  authenticate(req, res, next) {
    if (req.headers.authorization) {
      // console.log(req.headers.authorization);
      let decoded = jwt.verify(req.headers.authorization);
      TellerModel.findOne({
        nik: decoded.nik,
      })
        .then((user) => {
          if (user) {
            req.user = decoded;
            next();
          } else {
            throw Message.UNAUTHENTICATE;
          }
        })
        .catch(next);
    } else {
      throw Message.UNAUTHENTICATE;
    }
  }
}
