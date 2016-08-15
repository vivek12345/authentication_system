var Authentication = require('./controllers/authentication');
var passportService = require('./services/passport');
var passport = require('passport');

var requireAuth = passport.authenticate('jwt', { session: false });
var requireSignIn = passport.authenticate('local', { session: false });
module.exports = function(app) {
	app.get('/', requireAuth, function(req, res, next) {
		res.send({success: true});
	});
	app.post('/signin', requireSignIn, Authentication.signin);
	app.post('/signup', Authentication.signup);
}
