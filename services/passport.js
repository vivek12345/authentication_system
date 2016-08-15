var passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var LocalStrategy = require('passport-local');
var User = require('../models/user');
var config = require('../config');

var localOptions = {
	usernameField: 'email'
};

var localLogin = new LocalStrategy(localOptions, function(email, password, done) {
	User.findOne({email: email}, function(err, user) {
		if(err) { return done(err); };
		if(!user) {
			return done(null, false);
		}
		user.comparePassword(password, function(err, isMatch) {
			if(err) { return done(err); }
			if(!isMatch) {
				return done(null, false);
			}
			return done(null, user);
		});
	});
});
var jwtOptions = {
	jwtFromRequest: ExtractJwt.fromHeader('authorization'),
	secretOrKey: config.secret
};

var jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
	User.findById(payload.sub, function(err, user) {
		if(err) { return done(err, false); };
		if(user) {
			return done(null,user);
		} else {
			return done(null, false);
		}
	});
});
passport.use(jwtLogin);
passport.use(localLogin);


