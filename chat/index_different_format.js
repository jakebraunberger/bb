var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var express = require('express');
const sqlite3 = require('sqlite3').verbose();

app.use(express.static(__dirname));

let db = new sqlite3.Database('./display.db');
let sql = `SELECT * from DISPLAY order by time asc limit 1`;


// initially get the data
// db.all(sql, [], (err, rows) => {
// 	if (err) {
// 		throw err;
// 	}
// 	rows.forEach((row) => {
// 		console.log(row.REG10);
// 	});
// });

// then need to get the data later



app.get('/', function(req, res){
  res.sendFile('/index_different_format.html');
});

const chartArray = [];


io.on('connection', (socket) => {
	
    console.log('Connection.'); 
    io.emit('Connection');

    socket.on('add', (vals) => {
    	console.log(vals);
    })


    setInterval(function() {
        var r = [];
        
        db.all(sql, [], (err, rows) => {
			if (err) {
				throw err;
			}

			rows.forEach((datum) => {
				
				r.push(datum);
				
			});

		socket.emit('update', r);	
		});
		
        console.log('Update.\n');

    }, 5000);
});


http.listen(8080, function(){
	console.log('listening on *:8080');
});
