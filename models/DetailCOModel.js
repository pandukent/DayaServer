const mongoose = require('mongoose')
const Schema = mongoose.Schema;



const detailCOSchema = new Schema({
  communityOfficer: { type: String, Ref: 'comunityOfficer' },
  date: { type: Date, default: () => Date.now() + 7 * 60 * 60 * 1000 },
  type: { type: String, enum: ["Payment", "Loan"] },
  nominal: { type: Number, required: true },
  status: { type: String, enum: ["Process", "Done"], default: "Process" }
})

detailCOSchema.pre('save', function (next) {
  if (this.data) {
    let newDate = new Date(this.date)
    this.date = new Date(newDate.getTime() + 7 * 60 * 60 * 1000)
  }
  next();
});

let Detail = mongoose.model('detailCO', detailCOSchema);

module.exports = Detail