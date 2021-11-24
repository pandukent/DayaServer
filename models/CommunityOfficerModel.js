/**
 * teller id
 * coid
 * name
 * region
 * nik
 * password
 * total
 *
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { crypt } = require("../helpers");

const coSchema = new Schema(
  {
    _id: { type: String, required: true },
    teller: { type: String, Ref: "Teller" },
    name: { type: String, required: true },
    nik: { type: String, required: true, unique: true },
    region: { type: String, required: true },
    password: { type: String, required: true },
  },
  { _id: false }
);

coSchema.pre('save', function (next) {
  this.password = crypt.hashPassword(this.password);
  next();
});

let communityOfficer = mongoose.model("communityOfficer", coSchema);

module.exports = communityOfficer;
