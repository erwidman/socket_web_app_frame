



//____________________________________________________YOUR_CODE_HERE
var stores = {
  "walmart": {
    "book": [ 
      {
        "category": "reference",
        "author": "Nigel Rees",
        "title": "Sayings of the Century",
        "price": 8.95
      }, {
        "category": "fiction",
        "author": "Evelyn Waugh",
        "title": "Sword of Honour",
        "price": 12.99
      }, {
        "category": "fiction",
        "author": "Herman Melville",
        "title": "Moby Dick",
        "isbn": "0-553-21311-3",
        "price": 8.99
      }, {
         "category": "fiction",
        "author": "J. R. R. Tolkien",
        "title": "The Lord of the Rings",
        "isbn": "0-395-19395-8",
        "price": 22.99
      }
    ],
    "bicycle": {
      "color": "red",
      "price": 19.95
    }
  }
};

var dHandler;
module.exports = function(){
	DataHandler = require('../objects/dataHandler.js');
	init();
};



function init(){
	// dHandler.instantiateBackup(host,
	// 							user,
	// 							password,
	// 							database);

	dHandler.readObject('stores',function(data){
		console.log(data);
	});

	dHandler.saveObject('test',testData,function(err){
		if(!err){
			dHandler.backupFile("test");
		}
	});

	// dHandler.saveObject('stores',stores,function(err){
	// 	dHandler.backupFile('stores');
	// });

	// dHandler.loadFileFromBackup('stores',function(res){
	// 	console.log(res);
	// });

	setTimeout(function(){
		dHandler.queryObject('stores','$..book[?(@.price<10)]',function(data){
			console.log(data);
		});
	},5000);
}