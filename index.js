// Main Application initialization
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var http = require('http');
var router = require('./router');
var mongoose = require('mongoose');

// DB Setup
mongoose.connect('mongodb://localhost:auth/auth');
// App setup
var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/*' }));
router(app);
// Server setup
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
server.listen(PORT, function(err) {
	console.log("Listening on port: ", PORT);
});
