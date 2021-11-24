const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vaultSchema = new Schema({
  teller: { type: String, Ref: 'Teller' },
  date: { type: Date, default: () => Date.now() + 7 * 60 * 60 * 1000 },
  type: { type: String, enum: ["Payment", "Loan"] },
  nominal: { type: Number, default: 0 },
  balance: { type: Number, default: 0 },
});

vaultSchema.pre('save', function (next) {
  if (this.data) {
    let newDate = new Date(this.date)
    this.date = new Date(newDate.getTime() + 7 * 60 * 60 * 1000)
  }
  next();
});

const Vault = mongoose.model("Vault", vaultSchema);
module.exports = Vault;
