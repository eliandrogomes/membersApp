const express = require("express");
const serverless = require("serverless-http");
const createError = require("http-errors");
const membersRouter = require("./routes/members");

const app = express();

app.use(express.json());
app.use("/members", membersRouter);

app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500).json({
    message: "Error Message",
    error: err
  })
});

module.exports.member = serverless(app);