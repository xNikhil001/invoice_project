const { Schema, model } = require("mongoose");

const balanceSchema = new Schema({
  year: String,
  balance: Number
})

const accountSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  balances: [balanceSchema],
});

const Account = model("account", accountSchema);

module.exports = Account;
