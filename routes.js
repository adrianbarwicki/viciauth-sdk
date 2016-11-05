/*
    Additional routes provided to the express app for handling signup, login and facebook authentification
    @param app: Express App
    @param ViciAuthSDK : we need to have all methods accessible from here for configuration
    @todo: 
        API for asynchrouns authentification
*/

var async = require("async");
// passwort strategies
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var passport = require('passport');
var ejs = require("ejs");
var ViciAuthUserModel = require("./models/user.js");

module.exports = initRoutes;

function initRoutes(app,ViciAuthSDK) {
    console.log("[ViciAuthSDK] Setting authentification routes");
    console.log("[ViciAuthSDK] GET /viciauth/login : Login");
    console.log("[ViciAuthSDK] GET /viciauth/signup : Signup");
    console.log("[ViciAuthSDK] GET /viciauth/reset-pw : Restart password");
    console.log("[ViciAuthSDK] GET /viciauth/reset-pw : Changing password");
    console.log("[ViciAuthSDK] POST /viciauth/login : Session based login");
    console.log("[ViciAuthSDK] POST /viciauth/signup : Session based signup");
    console.log("[ViciAuthSDK] POST /viciauth/api/login : Token based login");
    console.log("[ViciAuthSDK] POST /viciauth/api/signup : Token based signup");
    /*
        Rendering templates config
    */
    app.set('view engine', 'ejs');
    app.set('view engine', 'ejs');
    app.set('layout', 'layout');
    
   /* 
       Persistent login sessions (optional)
       If authentication succeeds, a session will be established and maintained via a cookie set in the user's browser.
   */
    app.use(require('express-session')({ secret:  require('random-token')(256)  }));
    app.use(passport.initialize());
    app.use(passport.session());  
    
	passport.serializeUser(function(User, done) {
		return done(null, User);
	});

	passport.deserializeUser(function(User, done) {
		return done(null, User);
	});

	passport.use(new FacebookStrategy(ViciAuthSDK.FbConfig,fbAuthHandler));
    passport.use(new LocalStrategy(localLoginHandler));
    
    // read ViciAuth Token and Serialize User into Request
    app.use((req, res, next) => {
        next();
    });

    app.get('/viciauth/login', (req, res) => {
        res.render("viciauth.login.ejs");
    });

     app.get('/viciauth/signup', (req,res) => {
        res.render("viciauth.signup.ejs");
    });
    
    app.get('/viciauth/facebook', passport.authenticate('facebook', {
        scope: ['email']
    }));

    app.get('/viciauth/facebook/callback',passport.authenticate('facebook', {
            successRedirect: '/',
            failureRedirect: '/'
    }));    
    
    /* POST REQUESTS */
    app.post('/viciauth/login', localLoginHandler);
    app.post('/viciauth/signup', localSignupHandler);
    
    app.post('/viciauth/api/login',(req,res)=>{
        var email = req.body.email;
        var password = req.body.password;
        
        ViciAuthSDK.localLogin(email,password,(err,rUser) => {
          if(err){
            console.log("[ViciAuth] LocalSignup Error",err);
            return res.status(400).send(err);
          } 
          res.status(200).send(rUser);
        });
    });
    
    app.post('/viciauth/api/signup',(req,res)=>{
        var email = req.body.email;
        var password = req.body.password;
        
        ViciAuthSDK.localSignup(email, password, (err,rUser) => {
          if(err){
            console.log("[ViciAuth] LocalSignup Error",err);
            return res.status(400).send(err);
          } 
          res.status(200).send(rUser);
        });
    });
    
    app.get('/viciauth/logout', logout);

    function logout (req, res) {
        var returnTo = req.query.returnTo || '/';
        req.logout();
        delete req.session;
        res.redirect(returnTo);
    }

    /**
            (Session) Sets up POST path to which users can submit forms to login
            @bodyparam email {string}
            @bodyparam password {string}
    */    
    function localSignupHandler (req, res) {
        var email = req.body.email;
        var password = req.body.password;

        if(!email || !password){
            return res.status(400).send("INITIAL_PARAMS");
        }

        ViciAuthSDK.localSignup(email,password,(err,rUser) => {
          if(err){
            console.log("[ViciAuth] LocalSignup Error",err);
            return res.status(400).send(err);
          } 
          console.log(rUser);

         req.login(rUser, function(err) {
          if (err) { 
              return res.status(500).send(err); 
          }
          return res.redirect('/u/account');
         });
        });
    }
 
    /**
            (Session) Implements Password local Authentification strategy
            @param email {string}
            @param password {string}
            @param callback {done}
    */
    function localLoginHandler (req, res) {

        var email = req.body.email;
        var password = req.body.password;

        if(!email || !password){
            return res.status(400).send("INITIAL_PARAMS");
        }

        ViciAuthSDK.localLogin(email,password,(err,rUser) => {
                console.log(err,rUser);
                if(err){
                    console.log("[ViciAuth] LocalSignup Error",err);
                    return res.status(400).send(err);
                } 
                console.log(rUser);
                req.login(rUser, function(err) {
                      if (err) { 
                          return res.status(500).send(err); 
                      }
                      return res.redirect('/u/account');
                 });
        });
    }    

    /**
            (Session) Implementation of Passwort FB Authentification Strategy
            @param req {HTTPRequest}
            @param token {string} - Fb Token
            @param refreshToken {string} - refreshToken
            @param profile {Object} - fb profile (parsed by passwort library)
            @param done {callback} 
            @TODO
            Facebook Emails should be appended to ViciAuth profile
    */  
    function fbAuthHandler(req, token, refreshToken, profile, done) {
                var Profile = new ViciAuthSDK.Models.User();
                console.log(profile);         

                if(typeof profile == "undefined"){
                    console.log("[WARNING] Profile undefined");
                    profile={};
                }

                Profile.setFbId(profile.id);

                // add properties for user
                if (profile.id)
                 Profile.addProp("fb:id",profile.id);
                if (profile.gender)
                 Profile.addProp("gender",profile.gender);
                if (profile.displayName)
                 Profile.addProp("fb:displayName",profile.displayName);
                if (profile.profileUrl)
                 Profile.addProp("fb:profileUrl",profile.profileUrl);

                 Profile.setFbToken(token);
                 Profile.setFbRefreshToken(refreshToken);

                 console.log("[ViciAuth] [INFO] Connecting to FB.");
                 console.log(ViciAuthSDK);
                 console.log(Profile);

                if(!token){
                    done("No token returned");
                }

                ViciAuthSDK.connectToFacebook(token,refreshToken,Profile,(err,rUser)=>{
                    console.log("[ViciAuth] [INFO] responded",err,rUser);
                    if(err){
                        return done(JSON.stringify(err));
                    }
                    return done(err,{ userId : rUser.userId, token : rUser.token });
                });        
    }
}
