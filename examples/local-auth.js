var express = require("express");
var app = express();

// Authentification

// ..index would be normally ViciAuthSDK
var ViciAuth = require('../index')({apiKey : "xxx", appKey : "xxx" },app);
ViciAuth.FbConfig.setClientID("xxx");
ViciAuth.FbConfig.setClientSecret("xxx");
ViciAuth.FbConfig.setCallbackURL("xxx");
ViciAuth.configureRoutes(app);

// now we should have auth paths under /viciauth/signup, /viciauth/login

app.listen(8080);
