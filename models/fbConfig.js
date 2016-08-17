/*
@todo
 1. Custom Profile Modules
 2. Check Method
*/
var FbConfig = (function(){
        var FbConfig = function(clientID,clientSecret,callbackURL,passReqToCallback,profileFields){
  
            var defaultProfileFields = ['id', 'name', 'displayName', 'gender', 'profileUrl', 'email'];
  
            this.clientID = clientID;
			this.clientSecret = clientSecret;
			this.callbackURL = callbackURL;
			this.passReqToCallback = passReqToCallback || true;
			this.profileFields = profileFields || defaultProfileFields;
            
            this.setClientID = function(clientID){
                this.clientID = clientID;
            };
  
            this.setClientSecret = function(clientSecret){
                this.clientSecret = clientSecret;
            };
  
            this.setCallbackURL = function(callbackURL){
                this.callbackURL = callbackURL;
            };
  
            this.addToProfileFields = function(profileField){
                this.profileFields.push(profileField);
            };
  
          };
        return FbConfig;
  }());

module.exports = FbConfig;