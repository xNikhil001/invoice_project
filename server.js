const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const app = require("./app");

const PORT = process.env.PORT || 5000;
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.set("strictQuery", true);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log(err);
  });


app.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});
