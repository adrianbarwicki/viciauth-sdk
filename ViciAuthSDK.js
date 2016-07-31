var request = require("request");


var VERSION = "1.0";
var API_URL, APP_KEY, API_KEY;



var getRequestHeader = function(token){
  return {
    'User-Agent': 'ViciAuth SDK 1.0',
    'x-auth-viciauth-app-key' : APP_KEY,
    'x-auth-viciauth-api-key' : API_KEY,
    'x-auth-viciauth-token' : token,
  };
};

var checkToken = function(token,callback){

var options = {
  url: API_URL + "/auth/token",
  headers: getRequestHeader(token)
};

var postBody  = { token : token  };

options.form = postBody;

request.post(options, function(err, response, body) {
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
};

var connectToFacebook = function(token,refreshToken,Profile,callback){
  var options = {
  url: API_URL + "/auth/networks/facebook",
  headers: getRequestHeader(token)
};

  
var postBody  = { token : token, refreshToken : refreshToken, Profile : Profile };

options.form = postBody;
request.post(options,function(err, response, body) {
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
};


var localSignup = function(email,password,callback){
  var options = {
  url: API_URL + "/auth/local/signup",
  headers: getRequestHeader(null)
};

  
var postBody  = { email : email, password : password };

options.form = postBody;
request.post(options,function(err, response, body) {
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
};


var localLogin = function(email,password,callback){
 
 var options = {
  url: API_URL + "/auth/local/login",
  headers: getRequestHeader(null)
};

var postBody  = { email : email, password : password };
options.form = postBody;
request.post(options,function(err, response, body) {
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
};


var destroyToken=function(token,callback){
	console.error("destroy Token, missing function implemention, quick fix!");
	callback();
};

module.exports = function(ConfigKeys) {
  console.log("Starting ViciAuthSDK ...");
  if(!ConfigKeys.appKey||!ConfigKeys.apiKey){
    throw "appKey or apiKey not specified";
  }
  API_URL = "http://viciauth.com"
  APP_KEY = ConfigKeys.appKey;
  API_KEY = ConfigKeys.apiKey;
  
  
  return {
    destroyToken : destroyToken,
    checkToken : checkToken,
    connectToFacebook : connectToFacebook,
    localSignup : localSignup,
    localLogin : localLogin,
  };
}

