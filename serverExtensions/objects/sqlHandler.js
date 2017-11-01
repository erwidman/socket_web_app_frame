var mysql = require('mysql');


function reconnect(host,user,password,database,it){
		if(it.pool){
			it.pool.end(function(err){
				if(!err){
					console.log('::POOL DESTROYED - RECONNECTING');
					loadDB(host,user,password,database,it);
				}
				else{
					console.log("::POOL FAILED TO BE DESTROYED - REATTEMPTING");
					reconnect(host,user,password,database,it);
				}

			});
		}

}

function loadDB(host,user,password,database,it){

		var pool = mysql.createPool({host:host,
									 user:user,
									 password:password,
									 database:database});




		pool.on('error',function(err){
			if(err.fatal){
				it.connected = false;
				console.log('FATAL DB ERROR ~ RECONNECTING!');
				reconnect(host,user,password,database,it);
			}
			else
				console.log('DB ENCOUNTERED NOT FATAL ERROR!');
			
		});

		pool.getConnection(function(err,conn){
			if(err){
				reconnect(host,user,password,database,it);
				console.log("::UNABLE TO CONNECT TO DB");
			}
			else{
				console.log("::CONNECTION TO DB "+host+" SUCCESSFUL");
				it.connected = true;
				conn.release();
			}
		});

		return pool;

}


class SQLHandler{
	constructor(host,user,password,database){
		this.mysql = mysql;
		this.pool = loadDB(host,user,password,database,this);
	}

	query(query, bind, callback){

		if(!this.connected){
			setTimeout(function(query,bind,callback,it){
				it.query(query,bind,callback);
			},100,query,bind,callback,this);
			return;
		}

		this.pool.getConnection(function(err,conn){
			if(err)
				console.log("::FAILED TO CREATE CONNECTION TO DB");
			else{
				conn.query(query,bind,function(err,result){
					if(err)
						console.log("::FAILED TO MAKE QUERY");
					else{
						conn.release();
					}
					callback(err,result);
				});
			}
		});
	}


	getPool(){
		return this.pool;
	}

}

module.exports = SQLHandler;