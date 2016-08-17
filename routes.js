/*
    Additional routes provided to the express app for handling signup, login and facebook authentification
    @param app: Express App
    @param fbConfig : fbConfig Object, check models/fbConfig.js for reference
    @todo: 
        1. custom express-session secret.
        2. Implementation for the login and signup routes.
        3. API for asynchrouns authentification
*/


var async = require("async");
var FacebookStrategy = require('passport-facebook').Strategy;
var passport = require('passport');

var ViciAuthUserModel = require("./models/user.js");

module.exports = initRoutes;

function initRoutes(app,fbConfig,connectToFacebook) {
    
    console.log("[ViciAuthSDK] Setting authentification routes");
    console.log("[ViciAuthSDK] /viciauth/login : Login");
    console.log("[ViciAuthSDK] /viciauth/signup : Signup");
    console.log("[ViciAuthSDK] /viciauth/reset-pw : Restart password");
    console.log("[ViciAuthSDK] /viciauth/reset-pw : Changing password");
    
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

			var User, Profile,Photos,alreadyExists = false;

		    var Profile = new ViciAuthUserModel();
             
            if (profile.gender)
             Profile.addProp("gender",profile.gender);
            if (profile.displayName)
             Profile.addProp("fb:displayName",profile.displayName);
            if (profile.profileUrl)
             Profile.addProp("fb:profileUrl",profile.profileUrl);

             Profile.setFbToken(token);
             Profile.setFbRefreshToken(refreshToken);
        
             connectToFacebook(token, refreshToken,Profile,(err,rUser)=>{
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