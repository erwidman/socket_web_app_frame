var SQLHandler = require('./objects/sqlHandler.js');


var dbManager;
module.exports = function(){
	dbHandler = new SQLHandler('internal-dev.cmdjf9dcmjok.us-east-1.rds.amazonaws.com',
 							"bowling_user",
 							"QxeZsMyH78hKcbw",
 							'bowling');	
	start();
};



function start(){	
	dbHandler.query('select * from bowling_history',[],function(err,data){
		refactor(data);
	});
}

function refactor(data){
	var values = [];
	for(var i in data){
		var currRow = data[i];
		var gameData = JSON.parse(currRow.game_data); 
		let c = count(gameData);
		values.push([currRow.user_id,currRow.game_id,currRow.game_data,c[0],c[1],c[2],currRow.game_end,currRow.lane,c[3]]);
	}
	dbHandler.query('INSERT INTO new_bowling_history (user_id, game_id, game_details, strikes, spares, opens, date, lane, final_score) VALUES ' + dbHandler.mysql.escape(values),[],function(err,data){
		if(err)
			console.log(err);
		else
			console.log('success');
	});
}



function count(row){

	var returns = [0,0,0,0];
	var strikes = 0;
	var spares = 0;
	var opens = 0;
	var framesPlayed = 0;
	var finalScore = row[10].finalScore;
	for(var frame in row){
		var currFrame = row[frame];
		if(currFrame.rolls[0]==10)
			strikes++;
		else if(currFrame.rolls[0] + currFrame.rolls[1] == 10)
			spares++;
		if(currFrame.rolls[0]==0)
			opens++;
		if(currFrame.rolls[1]==0)
			opens++;
	}
	returns[0] = strikes;
	returns[1] = spares;
	returns[2] = opens;
	returns[3] = finalScore;

	return returns;
}

