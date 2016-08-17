module.exports = 
    
    
    
function(Module,Exports,Args){
    
    if(module.parent){
        Module.exports = Exports;
    } else if {
        
        
        var ModuleName = Args[1];
        var FunctionName = Args[2];
        console.log(´${ModuleName}${FunctionName}´);
    
        
        Exports[FunctionName](Args[3]);
    } 
    
};    