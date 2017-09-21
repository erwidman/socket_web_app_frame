var jpath = require('jsonpath');
var lz =  require('lzutf8');
var fs = require('fs');
var db = require('mysql');

class DataHandler{
	constructor(){
		this.isBackup = false;
	}
	queryObject(filename,queryString,callback){
		fs.readFile('json/'+filename+'.lz','utf8',function(err,data){
			
			lz.decompressAsync(data,{inputEncoding: "BinaryString", outputEncoding: "String"},function(result,err){
				callback(jpath.query(JSON.parse(result),queryString));
			});
		});
	}

	saveObject(filename,object,callback){
		object = JSON.stringify(object);
		lz.compressAsync(object,{outputEncoding: "BinaryString"}, function(res,err){ 
			if(!err){
				fs.writeFile('json/'+filename+'.lz',res,function(err){
					if(err)
						console.log(err);
					else
						console.log(filename+' written!');
					callback(err);
				}); 
			}
			else{
				console.log(err);
				callback(err);
			}
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


	instantiateBackup(host,user,password,database){

		if(this.con)
			this.con.destroy();

		this.host = host;
		this.user = user; 
		this.password = password; 
		this.database = database;
		this.con = db.createPool({
			host: host,
			user : user,
			password : password,
			database : database
		});

		this.con.on('error',function(err){
			if(err.fatal){
				console.log('FATAL DB ERROR ~ RECONNECTING!');
				this.reconnectToDB();
			}
			else
				console.log('DB ENCOUNTERED NOT FATAL ERROR!');
			
		});
	}

	reconnectToDB(){
		console.log('RECONNECTING TO DB!');
		if(this.con)
			this.con.destroy();

		this.con = db.createPool({
			host : this.host,
			user: this.user,
			password: this.password,
			database: this.database
		});


		this.con.on("error", function(err) {

			if (err.fatal){ 
				console.log('FATAL DB ERROR ~ RECONNECTING!');
				this.reconnectToDB();
		
			}
			else{
				console.log('DB ENCOUNTERED NOT FATAL ERROR!');
			}
		});
		
	}


	backupFile(filename){
		var it = this;
		this.con.getConnection(function(err,primary_connection){
			if(!err){
				console.log('CONNECTED!');
				it.readObject(filename,function(data){
					
					var backupObject = data;
					var tmpArray = [];


					for(var key in backupObject){
						tmpArray.push([key,JSON.stringify(backupObject[key])]);
					}

					//check existence of table
					primary_connection.query('select count(*) from ' +filename,function(err,result){
						if(!err){
							console.log('TABLE EXIST!');
							primary_connection.release();
							//TODO SET NEW DATA
						}
						else{
							console.log('TABLE DOES NOT EXIST!');
							var sql = 'CREATE TABLE ' + filename +  ' (id INT NOT NULL AUTO_INCREMENT ,title varchar(255) NOT NULL UNIQUE, info JSON, PRIMARY KEY (id))';
							primary_connection.query(sql,function(err,result){
								if(!err){
									console.log('TABLE CREATED!')
									sql = 'INSERT INTO '+ filename + '(title, info) VALUES ?';
									primary_connection.query(sql,[tmpArray],function(err){
										if(!err){
											console.log('FILE SUCCESSFULLY BACKED UP!');
											primary_connection.release();
										}
										else
											console.log(err);
									});
						
								}
								else
									console.log(err);
							});
						}
					});
				});
			}
			else
				console.log('FAILED TO CONNECT!');
		});
	}


}

module.exports = DataHandler;