require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");
const app = require("./app");

const PORT = +process.env.PORT || 3000;
const DB_URI = process.env.DATABASE_URI.replace(
  "<password>",
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB_URI).then(() => console.log("DB connected successfully"));

app.listen(PORT, () => console.log("Listening on PORT", PORT));
