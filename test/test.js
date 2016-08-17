var ViciAuthSDK = require("../index.js");
var FbConfigModel = require("../models/fbConfig.js");
var UserModel = require("../models/user.js");


(function(testName){
    console.log("Test",testName);
    var ConfigKeys = { apiKey : "xxxxxxxxx", appKey : "xxxxxxxxx" };
    var ViciAuth = new ViciAuthSDK(ConfigKeys);
}("SDK initialisation"));


(function(testName){
    console.log("Test",testName);
    try{
        var ViciAuth = new ViciAuthSDK();
        console.log("[Test failed] Should throw an error when key is not provided");
    } catch(err){
        if(err=="[ViciAuthSDK] AppKey or ApiKey not specified"){
            console.log("[Test OK]");
        }else{
            console.log("[Test Failed] Wrong error",err);
        }
    }
}("Test Call to Resource without Keys"));

(function(testName){
    console.log("Test",testName);
    try{
         var TestFbConfigModel = new  FbConfigModel();
         console.log("[Test OK]");
    } catch(err){
        console.log("[Test failed]",err);
    }
}("Create FbConfig Model"));


(function(testName){
    console.log("Test",testName);
    try{
         var TestUserModel = new  UserModel();
         console.log("[Test OK]");
    } catch(err){
        console.log("[Test failed]",err);
    }
}("Create User Model"));

/*
ConfigKeys.appKey : null;
  var API_KEY = ConfigKeys ? ConfigKeys.apiKey
ViciAuth.FbConfig.setClientID(config.fbConfig.clientID);
ViciAuth.FbConfig.setClientSecret(config.fbConfig.clientSecret);
ViciAuth.FbConfig.callbackURL(config.fbConfig.callbackURL);
ViciAuth.configureRoutes(app);
*/