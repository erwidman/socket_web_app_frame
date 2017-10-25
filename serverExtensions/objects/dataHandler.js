var jpath = require('jsonpath');
var lz =  require('lzutf8');
var fs = require('fs');
var db = require('mysql');

class DataHandler{
	constructor(host,user,password,database){
		if(host && user && password && database){
			this.instantiateBackupMYSQL(host,user,password,database);
		}
		console.log('DATAHANDLER INSTANTIATED!');
		
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


	instantiateBackupMYSQL(host,user,password,database){

	
		if(this.con)
			return;


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

		var it = this;
		this.con.on('error',function(err){
			if(err.fatal){
				console.log('FATAL DB ERROR ~ RECONNECTING!');
				it.reconnectToDB();
			}
			else
				console.log('DB ENCOUNTERED NOT FATAL ERROR!');
			
		});
	}

	reconnectToDB(){

		console.log('RECONNECTING TO DB!');
		if(this.con){
			this.con.end(function(err){
				if(!err){
					console.log('CONNECTION DISSCONNECTED!');
					setConnection();
				}
				else
					console.log(err);
			});
		}

		var it = this;
		function setConnection(){
			it.con = db.createPool({
				host : it.host,
				user: it.user,
				password: it.password,
				database: it.database
			});


			it.con.on("error", function(err) {

				if (err.fatal){ 
					console.log('FATAL DB ERROR ~ RECONNECTING!');
					it.reconnectToDB();
		
				}
				else{
					console.log('DB ENCOUNTERED NOT FATAL ERROR!');
				}
			});
		}
	}


	backupFileMYSQL(filename){
		var it = this;
		this.con.getConnection(function(err,primary_connection){
			if(!err){
				console.log('CONNECTED!');
				it.readObject(filename,function(data){
					
					var backupObject = data;
					var tmpArray = [];
					var tmpArray2 = [];


					for(var key in backupObject){
						tmpArray.push([key,JSON.stringify(backupObject[key])]);
						tmpArray2.push([key]);
					}

					//check existence of table
					primary_connection.query('select count(*) from ' +filename,function(err,result){
						if(!err){
							console.log('TABLE EXIST!');
							var sql = 'INSERT INTO '+ filename + ' (title, info) VALUES ? ON DUPLICATE KEY UPDATE info = VALUES(info)';
							primary_connection.query(sql, [tmpArray],function(err, result){
								if(!err){
									console.log('TABLE UPDATED!');
									sql = 'Delete from ' + filename + ' where title not in ?';
									primary_connection.query(sql,[tmpArray2],function(err,result){
										if(!err){
											console.log('DELETED OLD ROWS!');
										}
										else
											console.log(err);
										primary_connection.release();
									});

								}
								else{
									console.log(err);
									primary_connection.release();
								}
							});	
			
						}
						else{
							console.log('TABLE DOES NOT EXIST!');
							var sql = 'CREATE TABLE ' + filename +  ' (id INT NOT NULL AUTO_INCREMENT ,title varchar(255) NOT NULL UNIQUE, info JSON, PRIMARY KEY (id))';
							primary_connection.query(sql,function(err,result){
								if(!err){
									console.log('TABLE CREATED!');
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

	loadFileFromBackupMYSQL(filename,callback){
		this.con.getConnection(function(err,primary_connection){
			if(!err){
				var sql = 'Select title, info from ' + filename;
				primary_connection.query(sql,function(err,res){
					if(!err){
						console.log('CONTENTS OF FILE LOADED!');
						var retMap = {};
						for(var i in res ){
							retMap[res[i].title] = JSON.parse(res[i].info) ;
						}
						callback(retMap);
					}
					else
						console.log('FAILED TO RETREIVE FILE!');
					primary_connection.release();
				});
			}
			else
				console.log('FAILED TO CONNECT!');
		});
	}


}

module.exports = DataHandler;