

//____________________________________________________YOUR_CODE_HERE
var DataHandler = require('./objects/dataHandler.js');
var dHandler = new DataHandler(); 
console.log('DataHandler instantiated!');
var testData =
{
	'Eric' : '1',
	'Tom' :' 2'
};
dHandler.instantiateBackup('internal-dev.cmdjf9dcmjok.us-east-1.rds.amazonaws.com',
							"bowling_user",
							"QxeZsMyH78hKcbw",
							'bowling');
dHandler.saveObject('test',testData,function(err){
	if(!err){
		dHandler.backupFile("test");
	}

});




//____________________________________________________EXAMPLE
//
// var stores = {
//   "store": {
//     "book": [ 
//       {
//         "category": "reference",
//         "author": "Nigel Rees",
//         "title": "Sayings of the Century",
//         "price": 8.95
//       }, {
//         "category": "fiction",
//         "author": "Evelyn Waugh",
//         "title": "Sword of Honour",
//         "price": 12.99
//       }, {
//         "category": "fiction",
//         "author": "Herman Melville",
//         "title": "Moby Dick",
//         "isbn": "0-553-21311-3",
//         "price": 8.99
//       }, {
//          "category": "fiction",
//         "author": "J. R. R. Tolkien",
//         "title": "The Lord of the Rings",
//         "isbn": "0-395-19395-8",
//         "price": 22.99
//       }
//     ],
//     "bicycle": {
//       "color": "red",
//       "price": 19.95
//     }
//   }
// };

// dHandler.saveObject('stores',stores);

// setTimeout(function(){
	
// 	dHandler.queryObject('stores','$..book[?(@.price<10)]',function(data){
// 		console.log(data);
// 	});
// },5000);