var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const sqlite3 = require('sqlite3').verbose();



let db = new sqlite3.Database('./modbusReg.db');
let sql = `SELECT REG10 from REG order by time asc limit 5`;


// initially get the data
db.all(sql, [], (err, rows) => {
	if (err) {
		throw err;
	}
	rows.forEach((row) => {
		console.log(row.REG10);
	});
});

// then need to get the data later



app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

const chartArray = [];

sql = `SELECT REG10 from REG order by time desc limit 10`;

io.on('connection', (socket) => {
	
    console.log('go.'); 
    io.emit('go');

    socket.on('add', (vals) => {
    	console.log(vals);
    })

    socket.on('debug', (doughnut_data) => {
    	console.log('Data from client:\n');
    	console.log(doughnut_data.toString());
    })

    setInterval(function() {
        var r = [];
        
        db.all(sql, [], (err, rows) => {
			if (err) {
				throw err;
			}

			rows.forEach((datum) => {
				
				r.push(datum.REG10);
				
			})

		socket.emit('update', r);	
		});
		
        console.log('Update.\n');

    }, 1000);
});


http.listen(8080, function(){
	console.log('listening on *:8080');
});
