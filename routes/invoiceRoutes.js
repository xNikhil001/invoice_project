const router = require("express").Router();
const invoiceController = require("../controller/invoiceController");
const {
  checkIfAccountExists,
  checkId,
  checkIfInvoiceExists,
} = require("../utils/validations");

router.route("/createaccount").post(invoiceController.createAccount);
router
  .route("/createinvoice")
  .post(
    [checkId, checkIfAccountExists, checkIfInvoiceExists],
    invoiceController.createInvoice
  );
router.route("/getaccount").get(invoiceController.getAccounts);
router.route("/invoicelist").get(invoiceController.getInvoices);

module.exports = router;
