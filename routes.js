


/*
exports.viciauthConfig = {
	appKey: "YLLURCac8ZRo1ENOboq2WeoPsJNI036Vd0W17qo",
	apiKey: "MQgqXJvApiA2WC2BFz8OMQgqXJvApiA2WC2BFz8O",
};

exports.fbConfig = {
			clientID: "714270265376526",
			clientSecret: "bcf833aa4ed408950b1c83172000c9f5",
			callbackURL: "http://localhost:3020/viciauth/facebook/callback", //http://sirbz.com
			passReqToCallback: true,
			profileFields: ['id', 'name', 'displayName', 'gender', 'profileUrl', 'email']
};
*/



module.exports = initRoutes;

function initRoutes(app,passport,fbConfig) {

    var async = require("async");
    var FacebookStrategy = require('passport-facebook').Strategy;
    var passport = require('passport');
    
    app.use(require('express-session')({ secret: 'blsdkafkmkablablajsdnasdjasd' }));
    app.use(passport.initialize());
    app.use(passport.session());  
    
	passport.serializeUser(function(User, done) {
		return done(null, User);
	});

	
	passport.deserializeUser(function(User, done) {
		return done(null, User);
	});

	passport.use(new FacebookStrategy(fbConfig,(req, token, refreshToken, profile, done)=> {

			var User, Profile, Photos,alreadyExists = false;

		    var Profile = new ViciAuth.Models.User();
            if (profile.gender)
             Profile.addProp("gender",profile.gender);
            if (profile.displayName)
             Profile.addProp("fb:displayName",profile.displayName);
            if (profile.profileUrl)
             Profile.addProp("fb:profileUrl",profile.profileUrl);

             Profile.setFbToken(token);
             Profile.setFbRefreshToken(refreshToken);
        
             Profile.authFb((err,rUser)=>{
                 if(err){
                     return done(JSON.stringify(err));
                 }
                 done(err,{ userId : rUser.userId });
             });
        
		}));
 
        // read ViciAuth Token and Serialize User into Request
        app.use((req,res,next)=>{
            next();
        });

        app.get('/viciauth/login',(req,res)=>{
            res.send("Not implemented");
        });

        app.get('/viciauth/signup',(req,res)=>{
            res.send("Not implemented");
        });

        app.get('/viciauth/facebook',passport.authenticate('facebook', {
            scope: ['email']
        }));

        app.get('/viciauth/facebook/callback',passport.authenticate('facebook', {
                successRedirect: '/',
                failureRedirect: '/'
        }));    
    
}