require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

// HANDLING UNCAUGHT EXCEPTIONS (SYNC CODE) THROUGHOUT THE APP
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION FOUND💥 SHUTTING DOWN...");
  console.error(err.name, err.message);

  process.exit(1);
});

const app = require("./app");

const PORT = +process.env.PORT || 3000;
const DB_URI = process.env.DATABASE_URI.replace(
  "<password>",
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB_URI).then(() => console.log("DB connected successfully"));

const server = app.listen(PORT, () => console.log("Listening on PORT", PORT));

// HANDLING UNHANDLED PROMISE REJECTIONS (ASYNC CODE) THROUGHOUT THE APP
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection".toUpperCase());
  console.error(err.name, err.message);

  server.close(() => process.exit(1));
});
