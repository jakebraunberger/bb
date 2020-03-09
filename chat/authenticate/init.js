const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local');

const user = {
	username: 'test-user',
	passwordHash: 'something',
	id: 1
}

passport.use(new LocalStrategy(
	(username, password, done) => {
		findUser(username, (err, user) => {
			if (err) {
				return done(err);
			}

			// User not found
			if (!user) {
				return done(null, false);
			}
		

			// Hashed passwords and fixed time comparison
			bcrypt.compare(password, user.passwordHash, (err, isValid) => {
				if (err) {
					return done(err);
				}

				if (!isValid) {
					return done(null, false);
				}

				return done(null, user);
			});
		});
	}
	));