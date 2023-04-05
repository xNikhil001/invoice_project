const mongoose = require("mongoose");
const Account = require("../models/accountModel");
const Invoice = require("../models/invoiceModel");
const AppError = require("./appError");

// Helper function returns Boolean based on value passed i.e: the passed value is mongoose ObjectId or not
const isMongoId = (ID) => {
  return mongoose.Types.ObjectId.isValid(ID);
};

// Validation function to check if the account exists before updating the balance of the particular account
// if the account ID does not exist or duplicate ID is passed as data then error is thrown and message is sent back to client
module.exports.checkIfAccountExists = async (req, res, next) => {
  const { accountArray } = req.body;

  const newArr = accountArray.map((el) => el.accountId);

  const newResult = await Account.countDocuments({ _id: { $in: newArr } });

  if (newArr.length !== newResult) {
    return next(
      new AppError("Duplicate account ID or the account does not exist!", 404)
    );
  }

  next();
};

// Validation middleware function to check if the ID passed is valid mongoose ObjectId or not
module.exports.checkId = (req, res, next) => {
  const { customerId, accountArray } = req.body;

  if (!isMongoId(customerId)) return next(new AppError("Invalid ID", 404));

  const isAllIdValid = accountArray.every(
    (element) => isMongoId(element.accountId) === true
  );
  if (!isAllIdValid) return next(new AppError("Invalid ID", 404));

  next();
};

// validation middleware function to check if Invoice number for the same year already exists
module.exports.checkIfInvoiceExists = async (req, res, next) => {
  const { invoiceNumber, year } = req.body;

  const query = Invoice.find()
    .where("invoiceNumber")
    .equals(invoiceNumber)
    .where("year")
    .equals(year);

  const result = await query.exec();

  if (result.length > 0) {
    return next(
      new AppError("Invoice number for the same year already exists!", 404)
    );
  }

  next();
};
