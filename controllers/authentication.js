var User = require('../models/user');
var config = require('../config');
var jwt = require('jwt-simple');
function tokenForUser(user) {
	var time = new Date().getTime();
	return jwt.encode({sub: user.id, iat: time}, config.secret);
}
exports.signup = function(req, res, next) {
	// Retrive the email id and password from request object
	var email = req.body.email;
	var password = req.body.password;
	if(!email || !password) {
		return res.status(422).send({error: 'You must supply the email and password fields'});
	}
	// Search through all users to find if a user with a givem email id exists
	User.findOne({email: email}, function(err, existingUser) {
		// If there is error like unable to connect to database, call next and delegate the error
		if(err) { return next(err); }
		// If the user with the email id already exists, send a 422 error
		if(existingUser) {
			return res.status(422).send({error: 'Email Id Already Exists'});
		}
		// if it's a new user, save it to the database
		var user = new User({
			email: email,
			password: password
		});
		user.save(function(err, user) {
			if(err) { return next(err); };
			res.send({ token: tokenForUser(user) });
		});
	});
}
exports.signin = function(req, res, next) {
	res.send({ token: tokenForUser(req.user) });
}
