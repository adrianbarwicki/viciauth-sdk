/*
    ViciAuth User Model
*/

var ViciAuthModelsProfile = (function(){
   
   var Profile = function(){
        this.Props = [];
        this.fbId = null;
        this.fbToken = null;
        this.fbRefeshToken = null;
       
       
        this.addProp = addProp;
        this.setFbId = setFbId;
        this.setFbToken = setFbToken;
        this.setFbRefreshToken = setFbRefreshToken;
        this.getFbToken = getFbToken;
        this.getFbRefreshToken = getFbRefreshToken;
        
        function setFbId(fbId){
            this.fbId = fbId;
        }
       
        function addProp(key,value){
            this.Props.push({key:key, value: value});
        }
        
        function setFbToken(fbToken){
            this.fbToken = fbToken;
        }
        
        function setFbRefreshToken(fbRefeshToken){
            this.fbRefeshToken = fbRefeshToken;
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