/*
    ViciAuthSDK - Authentification libary for NodeJS for https://github.com/adrianbarwicki/vq-auth
    @version 1.0
    @desc Client Authentification Module to Communicate with ViciAuthAPI.
    @author Adrian Barwicki
*/

var UserModel = require("./models/user");
var FbConfigModel = require("./models/fbConfig.js");
var emailService = require("./services/emailService.js");
var VERSION = "1.0.0";
var httpClientFactory = require('./httpClientFactory');

var OPTS = {
    protocol:"http",
    host: 'viciauth.com',
    port: 80,
    prefix: '/',
    method: 'POST',
    headers: {
        'User-Agent': 'ViciAuth/Node-v1.0'
    }
};

module.exports = initSDK;

function initSDK (ConfigKeys, expressApp, passport, _opts) {
  _opts = _opts || {};
  OPTS.host = _opts.host || OPTS.host;
  OPTS.port = _opts.port || OPTS.port;

  ConfigKeys = ConfigKeys || {};
    
  if (!ConfigKeys.appKey || !ConfigKeys.apiKey) {
    throw "[ViciAuthSDK] AppKey or ApiKey not specified";
  }

  //var API_URL = OPTS.protoc;    
  var API_KEY = ConfigKeys ? ConfigKeys.apiKey : null;
  var APP_KEY = ConfigKeys ? ConfigKeys.appKey : null; 

  if (!APP_KEY || !API_KEY) {
    throw "[ERROR] [ViciQloudSDK] Missing APP KEY or API KEY!"
  }

  var ViciAuth = viciAuthSDK(API_KEY, APP_KEY);
  
  if (expressApp && passport) {
      ViciAuth.configureRoutes(expressApp, passport);  
  }

  return ViciAuth;
}

var viciAuthSDK = (apiKey, appKey) => {
    // @private
    var API_KEY = apiKey;
    var APP_KEY = appKey;
    var MANDRILL_KEY = '';
    var WELCOME_EMAIL = {};

    

    const getOPTS = JSON.parse(JSON.stringify(OPTS));

    getOPTS.method = 'GET';

    const httpClient = httpClientFactory(apiKey, appKey, OPTS);
    const httpClientGET = httpClientFactory(apiKey, appKey, getOPTS);

    // @public
    return {
        Models: {
            User: UserModel
        },
        FbConfig: new FbConfigModel(),
        configureRoutes,
        changePassword,
        setMandrillKey,
        setWelcomeEmail,
        checkToken,
        connectToFacebook,
        getEmailsFromUserId,
        getAuthUserIdFromEmail,
        localSignup,
        localLogin,
        destroyToken,
        requestPasswordReset,
        resetPassword
    };

    function setMandrillKey(key) {
       MANDRILL_KEY = key;
    }

    function setWelcomeEmail(html, subject, fromEmail) {
       WELCOME_EMAIL.init = true;
       WELCOME_EMAIL.html = html;
       WELCOME_EMAIL.subject = subject;
       WELCOME_EMAIL.fromEmail = fromEmail;
    }

    /**
        Configure local routes (only express apps supported) for Local Auth and Facebook Auth
        @param app{ExpressApp} - ExpressApp
        @logs information of configured routes
    */
    function configureRoutes(app) {
      require("./routes")(app, this);  
    }

    /**
        Changes user's password
    */   
    function changePassword (token, currentPassword, newPassword, callback) {
        var postBody = {
            token,
            currentPassword,
            newPassword
        };

        httpClient("/auth/password", postBody, callback);	
    } 

    

    /**
        Request a code for a new password
        @param email{string} - ViciAuth Auth Token
        @param callback{function}, called with (err, ViciAuthResetCode)
    */   
    function requestPasswordReset (email, callback) {
        var postBody = {
            email
        };

        httpClient("/auth/password/request-reset", postBody, callback);	
    }

    /**
        Request a code for a new password
        @param email{string} - ViciAuth Auth Token
        @param callback{function}, called with (err, ViciAuthResetCode)
    */   
    function resetPassword (code, password, callback) {
        var postBody = {
            code,
            password
        };

        httpClient("/auth/password/reset", postBody, callback);	
    }

    

    /**
        Verifies ViciAuth token and returns Users associated to this token
        @param token{string} - ViciAuth Auth Token
        @param refreshToken{string} - FB Auth Refresh Token
        @param callback{function}, called with (err,ViciAuthUser)
    */   
    function checkToken (token, callback) {
        var postBody = {
            token
         };

        httpClient("/auth/token", postBody, callback);	
    }    

    /**
        Destroys ViciQloud Token
        @param token{string} - ViciAuth Auth Token
        @param callback{function}, called with (err)
    */   
    function destroyToken (token, callback) {
        var postBody = {
            token
        };

        httpClient("/auth/logout", postBody, callback);	
    }

    /**
        Facebook Auth -> needs to be preconfigured by the client (@see FbConfig)
        @param token{string} - FB Auth Token
        @param refreshToken{string} - FB Auth Refresh Token
        @param Profile{ViciAuthProfile} - contains Emails[] and Props[] 
        @param callback{function}, called with (err,ViciAuthUser)
    */
    function connectToFacebook(token,refreshToken,Profile,callback){
        console.log("[ViciAuth] Connecting to FB", token, refreshToken, Profile);
        
        var postBody = {
            token, 
            refreshToken,
            Profile 
        };

        httpClient("/auth/networks/facebook",postBody,callback);
    }

    function getAuthUserIdFromEmail(email, callback) {
        httpClientGET(`/auth/user?email=${email}`, false, callback);
    }

    function getEmailsFromUserId(userId, callback) {
        httpClientGET(`/auth/user?userId=${userId}`, false, callback);
    }

    /**
        Local signup with email and password
        @param email{string}
        @param password{string}
        @param callback{function}
    */
    function localSignup(email, password, callback){
        var postBody = {
            email,
            password 
        };

        httpClient("/auth/local/signup", postBody, callback);

        if (WELCOME_EMAIL.init) {
            emailService.sendEmail(MANDRILL_KEY, email, WELCOME_EMAIL.html, WELCOME_EMAIL.subject, WELCOME_EMAIL.fromEmail);
        }
    }

    /**
        Local login with email and password
        @param email{string}
        @param password{string}
        @param callback{function}
    */
    function localLogin(email, password, callback) {
        var postBody  = { 
            email,
            password
        };

        httpClient("/auth/local/login",postBody,callback);   
    }
};
