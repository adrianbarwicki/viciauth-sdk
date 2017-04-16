/*
    ViciAuthSDK - Authentification libary for NodeJS for https://github.com/adrianbarwicki/vq-auth
    @version 1.0
    @desc Client Authentification Module to Communicate with ViciAuthAPI.
    @author Adrian Barwicki
*/

var request = require("request");
var UserModel = require("./models/user");
var FbConfigModel = require("./models/fbConfig.js");
var emailService = require("./services/emailService.js");
var VERSION = "1.0.0";

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

function initSDK(ConfigKeys, expressApp, passport, _otherHost) {
  OPTS.host = _otherHost || OPTS.host;

  ConfigKeys = ConfigKeys || {};
    
  if(!ConfigKeys.appKey||!ConfigKeys.apiKey){
    throw "[ViciAuthSDK] AppKey or ApiKey not specified";
  }

  //var API_URL = OPTS.protoc;    
  var API_KEY = ConfigKeys ? ConfigKeys.apiKey : null;
  var APP_KEY = ConfigKeys ? ConfigKeys.appKey : null; 
  if( !APP_KEY || !API_KEY ){
    throw "[ERROR] [ViciQloudSDK] Missing APP KEY or API KEY!"
  }
  
  var ViciAuth = (new ViciAuthSDK(API_KEY,APP_KEY));
  
  if (expressApp && passport) {
      ViciAuth.configureRoutes(expressApp, passport);  
  }

  return ViciAuth;
}

var ViciAuthSDK = (function(){
 
var ViciAuthSDK = function(apiKey,appKey){
    
    //@private
    //var API_URL = apiUrl;
    var API_KEY = apiKey;
    var APP_KEY = appKey;
    var MANDRILL_KEY = '';

    var WELCOME_EMAIL = {};

    //@public
    // Models
    this.Models={
      User : UserModel
    };

    this.FbConfig = new FbConfigModel;

    this.addToProfileFields = function(profileField){
        this.profileFields.push(profileField);
    };
    
    this.configureRoutes = configureRoutes;

    this.setMandrillKey = function(key) {
       MANDRILL_KEY = key;
    };

    this.setWelcomeEmail = function (html, subject, fromEmail) {
       WELCOME_EMAIL.init = true;
       WELCOME_EMAIL.html = html;
       WELCOME_EMAIL.subject = subject;
       WELCOME_EMAIL.fromEmail = fromEmail;
    };

    this.checkToken = checkToken;
    this.connectToFacebook = connectToFacebook;
    this.localSignup = localSignup; 
    this.localLogin = localLogin;
    this.destroyToken = destroyToken;
 
    /**
        Configure local routes (only express apps supported) for Local Auth and Facebook Auth
        @param app{ExpressApp} - ExpressApp
        @logs information of configured routes
    */
    function configureRoutes(app){
      require("./routes")(app, this);  
    }

    /**
        Verifies ViciAuth token and returns Users associated to this token
        @param token{string} - ViciAuth Auth Token
        @param refreshToken{string} - FB Auth Refresh Token
        @param callback{function}, called with (err,ViciAuthUser)
    */   
    function checkToken(token,callback){
        var postBody  = { token : token  };
        ViciAuthSDK.httpClient("/auth/token",postBody,callback);	
    }    

    /**
        Destroys ViciQloud Token
        @param token{string} - ViciAuth Auth Token
        @param callback{function}, called with (err)
    */   
    function destroyToken(token,callback){
        var postBody  = { token : token  };
        ViciAuthSDK.httpClient("/auth/destroy-token",postBody,callback);	
    }

    /**
        Facebook Auth -> needs to be preconfigured by the client (@see FbConfig)
        @param token{string} - FB Auth Token
        @param refreshToken{string} - FB Auth Refresh Token
        @param Profile{ViciAuthProfile} - contains Emails[] and Props[] 
        @param callback{function}, called with (err,ViciAuthUser)
    */
    function connectToFacebook(token,refreshToken,Profile,callback){
        console.log("[ViciAuth] Connecting to FB",token,refreshToken,Profile);
        
        var postBody  = { token : token, refreshToken : refreshToken, Profile : Profile };
        ViciAuthSDK.httpClient("/auth/networks/facebook",postBody,callback);
    }

    /**
        Local signup with email and password
        @param email{string}
        @param password{string}
        @param callback{function}
    */
    function localSignup(email, password, callback){
        var postBody  = { email: email, password: password };
        ViciAuthSDK.httpClient("/auth/local/signup",postBody,callback);

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
    function localLogin(email,password,callback){
        var postBody  = { email : email, password : password };   
        ViciAuthSDK.httpClient("/auth/local/login",postBody,callback);   
    }

    ViciAuthSDK.httpClient = httpClient
        
    /**
        HTTP (POST requests) Client for ViciAuth, sends requests with viciauth app key and api key in header
        @param uri{string} - API paths of ViciAuth.com
        @param params{Object} - Body of the request
        @param callback{function}, called with (err,ViciAuthUser)
    */
    function httpClient(uri, params, callback) {
         console.log("[INFO] [ViciAuth] Calling uri %s",uri);
        
         params = params || {};
         if(!callback){
             throw "[ERROR] call method must be provided with callback function!"
         }
        
         if(!APP_KEY){
             console.log("[WARNING] [ViciAuth] No app key");
         }
        
         if(!API_KEY){
             console.log("[WARNING] [ViciAuth] No api key");
         }
        
         var requestOptions = {
             headers : OPTS.headers || {}
         };
        
         requestOptions.url = OPTS.protocol + "://" + OPTS.host + ":" + OPTS.port + uri;
         requestOptions.headers['x-auth-viciauth-app-key'] = APP_KEY;
         requestOptions.headers['x-auth-viciauth-api-key'] = API_KEY;
         requestOptions.headers['x-auth-viciauth-token'] = params.token
         requestOptions.form = params; //{ token : params.token };
        
        
        console.log("[ViciAuth] Request options",requestOptions);
        request.post(requestOptions, (err, response, body) => {
          if(err){
            try{
              err = JSON.parse(err);
            }catch(e){
              console.error(err);
            }
            return callback({status:502,err:err});
          }

          if(body){
            try{
              body = JSON.parse(body);
            }catch(err){
              console.error("[ERROR] ViciAuthSDK : Something went wrong");
              console.error(err);
              body = {};
              return callback(err);
            }
          } else {
             body = {};
          }

          if (response.statusCode !== 200) {
            return callback({status:response.statusCode, err : body});
          }

          return callback(null,body);

        });      
    }   

}

return ViciAuthSDK;  
}());
