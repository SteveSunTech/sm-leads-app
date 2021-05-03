const express = require("express");
const app = express();
const connectDB = require("../config/db");
const path = require("path");

// Connect Database
connectDB();

// Init Middleware
// @yuchen
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type,X-Requested-With,x-auth-token, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,HEAD,DELETE,OPTIONS"
  );
  next();
});
app.use(express.json({ extended: false }));

// Define Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/basic", require("./routes/basicUser"));
app.use("/api/am", require("./routes/amUser"));
app.use("/api/lead", require("./routes/lead"));
app.use("/api/admin", require("./routes/adminUser"));
app.use("/api/leadprofile", require("./routes/leadsProfile"));

// app.use("/am", require("./routes/amUser"));

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// // Backend
const data = require("./dataModification/data");
// data.profileGenerator();
// data.leadsUpdateCheck();
// data.amUserModification();
// data.kpi();
// data.userTransfer();
// data.newAmUser();
