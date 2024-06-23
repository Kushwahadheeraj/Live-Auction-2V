import GoogleStrategy from "passport-google-oauth20"
import passport from "passport";

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.CLIENT_ID,
			clientSecret: process.env.CLIENT_SECRET,
			callbackURL: "http://localhost:3000/api/v2/users/google/callback",
			// scope: ["profile", "email"],
			passReqToCallBack:true
		},
		function (accessToken, refreshToken, profile, callback) {
		 return	callback(null, profile);
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});