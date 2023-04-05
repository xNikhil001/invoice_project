const Account = require("../models/accountModel");
const Invoice = require("../models/invoiceModel");
const { catchAsync } = require("../utils/catchAsync");

module.exports.createAccount = catchAsync(async (req, res, next) => {
  const { name, balances } = req.body;

  let data = new Account({
    name,
    balances,
  });

  const result = await data.save();

  res.json({ status: "success", result });
});
module.exports.createInvoice = catchAsync(async (req, res, next) => {
  const { customerId, totalAmount, year, accountArray, invoiceNumber } =
    req.body;
  // const invoiceNumber = Math.random().toString().slice(3, 8);
  // console.log(invoiceNumber);

  const invoiceData = new Invoice({
    customerId,
    accountArray,
    totalAmount,
    invoiceNumber,
    year,
  });
  const result = await invoiceData.save();

  res.json({ status: "success", data: result });
});
module.exports.getAccounts = catchAsync(async (req, res, next) => {
  const result = await Account.find();
  res.json({ status: "success", data: result });
});
module.exports.getInvoices = catchAsync(async (req, res) => {
  const { skip, limit, search } = req.query;
  console.log(search)
  const result = await Invoice.aggregate([
    {
      '$lookup': {
        'from': 'accounts', 
        'localField': 'accountArray.accountId', 
        'foreignField': '_id', 
        'as': 'accounts'
      }
    }, {
      '$match': {
        '$or': [
          {
            'invoiceNumber': {
              '$regex': search, 
              '$options': 'i'
            }
          }, {
            'accounts.name': {
              '$regex': search, 
              '$options': 'i'
            }
          }, {
            'accounts.amount': {
              '$regex': search, 
              '$options': 'i'
            }
          }
        ]
      }
    }, {
      '$unset': 'accounts'
    }
  ])
  console.log(result)
  res.json({ status: "success", data: result });
});
