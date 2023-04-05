const express = require("express");
const app = express();
const cors = require("cors");
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controller/errorController')
const invoiceRouter = require("./routes/invoiceRoutes");

// data parsing middlewares
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes middlwares
app.use("/api", invoiceRouter);

// Handle non existing routes
app.all("*", (req, res, next) => {
  let message = `the requested url: '${req.originalUrl}' was not found`;

  next(new AppError(message,404))
});

// Handle occuring errors globally
app.use(globalErrorHandler);

module.exports = app;
