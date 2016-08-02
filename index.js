/*
@name ViciAuthSDK
@version 1.0
@desc Client Authentification Module to Communicate with ViciAuthAPI.
@author Adrian Barwicki

@copyright
ViciQloud UG (haftungsbeschränkt)
Robert-Bosch-Strasse 49
69190 Walldorf
adrian.barwicki@viciqloud.com
*/

var request = require("request");

var VERSION = "1.0";
var API_URL, APP_KEY, API_KEY;

module.exports = initSDK;
	
function initSDK(ConfigKeys) {
  if(!ConfigKeys.appKey||!ConfigKeys.apiKey){
    throw "[ViciAuthSDK] AppKey or ApiKey not specified";
  }
    
  API_URL = "http://viciauth.com"
  
  APP_KEY = ConfigKeys ? ConfigKeys.appKey || null;
  API_KEY = ConfigKeys ? ConfigKeys.apiKey || null;

  if(!APP_KEY || !API_KEY){
    throw "[ViciQloudSDK] Missing APP KEY or API KEY"
  }
  
  return (new ViciAuthSDK(API_URL,APP_KEY,API_KEY));
}

var ViciAuthSDK = (function(){

var ViciAuthSDK = function(apiUrl,apiKey,appKey){
    
// private attrs
var API_URL = apiUrl;
var API_KEY = apiKey;
var APP_KEY = appKey;
 
    
// public methods    
this.destroyToken = destroyToken;
this.checkToken = checkToken;
this.connectToFacebook = connectToFacebook;
this.localSignup = localSignup;
this.localLogin = localLogin;
    
    
function getRequestHeader(token){
  return {
    'User-Agent': 'ViciAuth SDK 1.0',
    'x-auth-viciauth-app-key' : APP_KEY,
    'x-auth-viciauth-api-key' : API_KEY,
    'x-auth-viciauth-token' : token,
  };
}

function checkToken(token,callback){

var options = {
  url: API_URL + "/auth/token",
  headers: getRequestHeader(token)
};

var postBody  = { token : token  };

options.form = postBody;

request.post(options,(err, response, body) => {
  if(err){
    return callback({status:502,err:err});
  }
   if(body){
       
    try{
      body = JSON.parse(body);
    }catch(err){
      console.log(err);
      body = {};
    }
    } else {
     body = {};
    }
  
  if (response.statusCode == 200) {
    

    return callback(null,body);
  }
  
  return callback({status:response.statusCode, err : body});
 
});
	
}

function connectToFacebook(token,refreshToken,Profile,callback){
  var options = {
  url: API_URL + "/auth/networks/facebook",
  headers: getRequestHeader(token)
}

  
var postBody  = { token : token, refreshToken : refreshToken, Profile : Profile };

options.form = postBody;
request.post(options,(err, response, body) => {
  if(err){
    console.log(err);
    try{
      err = JSON.parse(err);
    }catch(e){
      console.log("[ViciAuth] Error could not be parsed");
    }
    return callback({status:502,err:err});
  }
  
   if(body){
    try{
      body = JSON.parse(body);
    }catch(err){
      console.log("[ViciAuth] Body could not be parsed",err);
      body = {};
    }
    } else {
     body = {};
    }
  
  if (response.statusCode == 200) {
    return callback(null,body);
  }
  
  return callback({status:response.statusCode, err : body});
 
});
}


function localSignup(email,password,callback){
  var options = {
  url: API_URL + "/auth/local/signup",
  headers: getRequestHeader(null)
}

  
var postBody  = { email : email, password : password };

options.form = postBody;
request.post(options,(err, response, body) => {
  if(err){
    try{
      err = JSON.parse(err);
    }catch(e){
      err = {};
    }
    return callback({status:502,err:err});
  }
      
    if(body){
    try{
      body = JSON.parse(body);
    }catch(err){
      console.log(err);
      body = {};
    }
    } else {
     body = {};
    }
  
  if (response.statusCode == 200) {
    return callback(null,body);
  }
  
  return callback({status:response.statusCode, err : body});
 
});
}


function localLogin(email,password,callback){
 
 var options = {
  url: API_URL + "/auth/local/login",
  headers: getRequestHeader(null)
};

var postBody  = { email : email, password : password };
options.form = postBody;
request.post(options, (err, response, body) => {
  if(err){
    try{
      err = JSON.parse(err);
    }catch(e){
      err = {};
    }
    return callback({status:502,err:err});
  }
  console.log(body);
      if(body){
    try{
      body = JSON.parse(body);
    }catch(err){
      console.log(err);
      body = {};
    }
    } else {
     body = {};
    }
  
  if (response.statusCode == 200) {
    return callback(null,body);
  }
  console.log(response.statusCode);
  return callback({status:response.statusCode, err : body});
 
});
}

function destroyToken(token,callback){
	console.error("Destroy Token, missing function implemention, quick fix!");
	callback();
}
}; 
    
  return ViciAuthSDK;  

}());

