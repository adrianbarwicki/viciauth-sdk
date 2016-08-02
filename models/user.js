var ViciAuthModelsProfile = (function(){
   
   var Profile = function(){
        this.Props = [];
        this.fbToken = null;
        this.fbRefeshToken = null;
        this.addProp = addProp;
        this.setFbToken = setFbToken;
        this.setFbRefreshToken = setFbRefreshToken;
        this.getFbToken = getFbToken;
        this.getFbRefreshToken = getFbRefreshToken;
        
        // Supported Auth Methods : Facebook
        this.authFb = authFb;
        
        function authFb(callback){
            ViciAuth.connectToFacebook(this.getFbToken(),this.getFbRefreshToken(),this,(err, rUser)=>{
                    if(err){
                        console.error(err);
                        return callback(err);
                    }
					return callback(err,{ userId : rUser.userId });
            });
        }
        
        function addProp(key,value){
            this.Props.push({key:key, value: value});
        };   
        
        function setFbToken(fbToken){
            this.fbToken = fbToken;
        }
        
        function setFbRefreshToken(fbToken){
            this.fbToken = fbToken;
        }
        
        function getFbToken(){
            return this.fbToken;
        }
        
        function getFbRefreshToken(){
            return this.fbRefreshToken;
        }
    }; 
     return Profile;
}());

module.exports = ViciAuthModelsProfile;