const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { crypt } = require('../helpers');

let tellerOfficerSchema = new Schema({
  _id: { type: String, required: true },
  nik: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  photo: {type:String},
  password: { type: String, required: true }
}, { _id: false })

tellerOfficerSchema.pre('save', function (next) {
  this.password = crypt.hashPassword(this.password);
  next();
});

const Teller = mongoose.model('Teller', tellerOfficerSchema);

module.exports = Teller