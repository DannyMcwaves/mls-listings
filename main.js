/*
	okay, okay, okay and this is all the module of the web thing i am trying so hard to create
	and then i will name third one the app thing for me to be able to get the rest of the webpage up
	running from the scratch to the top.
*/

var express = require("express"),
	path = require("path"),
	logger = require("morgan"),
	body_parser = require("body-parser"),
	cookie_parser = require("cookie-parser"),
	index = require("./routes/index"),
	app = express(),
	db = require('./db/db');


// this is used to provide the rendering engine of the main html templates.
// this is setting the path where you can find the rendering engine.
app.set("views", path.join(__dirname, 'views'));

// this is the development environment i am using now.
app.set("env", "development");

// I am disabling the caching of the files because this is for development
// purposes only and not for production.
app.set("view cache", false);

// this is to remove the x-powered-by thing in the express app.
app.set("x-powered-by", false);

// i think i should check strict routing too in the file sample below.
app.set("strict routing", true);

// this is for setting the view engine for the file.
// and then i set this one to jade though.
app.set("view engine", 'jade');
app.set("appName", "Express 1.0");

// app.use(body_parser.json());
app.use(body_parser.urlencoded({extended: true}));

cookie = "any-random-word-that-any-douchebag-can-think-of-like-2iu467826489289467824";
app.use(cookie_parser(cookie));

// this one is to log the requests that are coming in to the console.
app.use(logger("dev"));
// this is used to parse the body of the payload of the string

// this section of the file is to serve static file.
// including all of the different.
app.use("/fonts", express.static("./fonts"));
app.use("/images",  express.static("./images"));
app.use("/js", express.static("./js"));
app.use("/css", express.static("./css"));


app.get("*", index);

app.use(function (err, req, res, next) {
	"use strict";
	res.status(400).send({message: err.message, error: err.stack});
});

module.exports = app;
