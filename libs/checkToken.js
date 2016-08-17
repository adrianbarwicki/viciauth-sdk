
 if(module.parent){
        module.exports = checkToken;
 } else {
        checkToken(process.argv[3]);
 }

var defaultCallback=function(err,data){
    if(err){
        console.error("[ERROR]",err);
    }else{
        console.error("[OK]",data);
    }
};        
        
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