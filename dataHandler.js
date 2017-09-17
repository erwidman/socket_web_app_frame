var jpath = require('jsonpath');
var lz =  require('lzutf8');
var fs = require('fs');
class DataHandler{
	constructor(){
	
	}
	queryObject(filename,queryString,callback){
		fs.readFile('json/'+filename+'.lz','utf8',function(err,data){
			
			lz.decompressAsync(data,{inputEncoding: "BinaryString", outputEncoding: "String"},function(result,err){
				callback(jpath.query(JSON.parse(result),queryString));
			});
		});
	}

	saveObject(filename,object){
		object = JSON.stringify(object);
		lz.compressAsync(object,{outputEncoding: "BinaryString"}, function(res,err){ 
			if(!err){
				fs.writeFile('json/'+filename+'.lz',res,function(err){
					if(err)
						console.log(err);
					else
						console.log(filename+' written!');
				}); 
			}
			else
				console.log(err);
		});	
	}

	readObject(filename,callback){
		fs.readFile('json/'+filename+'.lz','utf8',function(err,data){
				if(!err){
					lz.decompressAsync(data,{inputEncoding: "BinaryString", outputEncoding: "String"},function(result,err){
						callback(JSON.parse(result));
					});
				}
				else
					console.log(err);
		});
	}


}

module.exports = DataHandler;