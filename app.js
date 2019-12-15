const cookieSession = require("cookie-session");
const config = require("./config");
//^
const express = require("express");
const createError = require("http-errors");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
//v
const mongoose = require("mongoose");
mongoose.connect(config.db, { useNewUrlParser: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log(`\nJestem połączony z mongoDB Atlas :)\n`);
});

const indexRouter = require("./routes/index");
const adminRouter = require("./routes/admin");
const newsRouter = require("./routes/news");
const quizRouter = require("./routes/quiz");
const apiRouter = require("./routes/api");
//^
const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

app.use(
  cookieSession({
    name: "session",
    // ma się ładować z pliku konfiguracyjnego
    keys: config.keySession,
    maxAge: config.maxAgeSession
  })
);

app.use("/", indexRouter);
app.use("/admin", adminRouter);
app.use("/news", newsRouter);
app.use("/quiz", quizRouter);
app.use("/api", apiRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
