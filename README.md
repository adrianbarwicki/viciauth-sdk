# viciauth-sdk
SDK for ViciAuth.com


## Initialisation
```
var ViciAuth = require('ViciAuthSDK')({apiKey : "xxx", appKey : "xxx" },expressApp);
```
Currently ViciAuth is in Alpha and the keys are given only to selected startups.



'x-auth-viciauth-app-key' : ViciAuth App key
'x-auth-viciauth-api-key' : ViciAuth Api key

Each of the users of your app, can have one or more token issued by ViciAuth. 
'x-auth-viciauth-token' : params.token

You can also configure FB authentification:
ViciAuth.FbConfig.setClientID("yourclientid");
ViciAuth.FbConfig.setClientSecret("yourclientsecret");
ViciAuth.FbConfig.setCallbackURL("https://yourpagename.com/fbcallback");

ViciAuthSDK comes with some preconfigured routes for common authentification actions like login, singup and logout.
This will set up the routes under /viciauth/login, /viciauth/signup, /viciauth/signup,
ViciAuth.configureRoutes(expressApp);

In detail:

Local authentification
GET /viciauth/login : Local Login
GET /viciauth/signup : Local Signup
GET /viciauth/reset-pw : Restart password
POST /viciauth/login : Token based login
POST /viciauth/signup : Token based signup

Facebook authentification
GET '/viciauth/facebook' : Facebook authentification
GET /viciauth/facebook/callback : URL for Facebook callback



ViciAuthSDK comes with the following public methods:

ujViciAuthSDK#destroyToken
ViciAuthSDK#checkToken
ViciAuthSDK#localSignup
ViciAuthSDK#localLogin


ViciAuthSDK#connectToFacebook
Example:
```
            var Profile = new ViciAuthSDK.Models.User();
            // required : setting profile id and access token
            Profile.setFbId(profile.id);
            Profile.setFbToken(token);
            
            // optional
            Profile.setFbRefreshToken(refreshToken);
    
            // Optional : add properties for user
            Profile.addProp("propertyKey","propertyValue");
            
            ViciAuthSDK.connectToFacebook(token,refreshToken,Profile,(err,rUser)=>{
                 /*
                    ViciAuth User retured 
                    {
                        userId : "xxxxx", // number length 10
                        token : "xxxxxxxxxx" // string length 256 
                    }
                 */
                 
            });        
```

##Licence
MIT



