const mongoose = require("mongoose");
const Account = require("./accountModel");

const accountArraySchema = new mongoose.Schema({
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
  },
  amount: {
    type: Number,
  },
});

const invoiceSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now(),
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  accountArray: {
    type: [accountArraySchema],
    required: true,
    validate: {
      validator: function () {
        return this.accountArray.length > 0;
      },
      message: "Account Array should have at least one record",
    },
  },
  totalAmount: {
    type: Number,
    required: [true, "total amount cannot be empty!"],
  },
  invoiceNumber: {
    type: String,
    required: [true, "invoice number cannot be empty!"],
  },
  year: {
    type: String,
    required: [true, "year cannot be empty!"],
  },
});

// Validation for Account Array amount sum not equal to Total amount
invoiceSchema.pre("save", function (next) {
  const amount = this.accountArray.reduce((prev, nxt) => {
    return prev + nxt.amount;
  }, 0);

  if (amount !== this.totalAmount) {
    const err = new Error("account array amount is not equal to total amount");
    return next(err);
  }
  next();
});

// Update account amount using mongoose middleware
invoiceSchema.post("save", async function () {
  const newArr = this.accountArray.map((el) => {
    return {
      updateOne: {
        filter: { _id: el.accountId },
        update: { $set: { "balances.$[elem].balance": el.amount } },
        arrayFilters: [{ "elem.year": { $eq: this.year } }],
        upsert: true,
      },
    };
  });

  const result = await Account.bulkWrite(newArr);
});

const Invoice = mongoose.model("Invoice", invoiceSchema);

module.exports = Invoice;
