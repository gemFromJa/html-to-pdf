var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

const { rateLimiter } = require("./middleware/rate_limiter");
var templateRouter = require("./routes/template_parser");

var app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(rateLimiter);
app.use("/parse", templateRouter);

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// send the error response
	res.status(err.status || 500);
	console.log(err);
	res.send({ success: false, error: err.message });
});

module.exports = app;
