var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const sqlite3 = require('sqlite3').verbose();



let db = new sqlite3.Database('./modbusReg.db');
let sql = `SELECT REG10 from REG order by time asc limit 10`;


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

sql = `SELECT REG10 from REG order by time desc limit 5`;

io.on('connection', (socket) => {
	
    console.log('go.'); 
    io.emit('go');

    socket.on('add', (vals) => {
    	console.log(vals);
    })

    setInterval(function() {
        var r = [];
        
        db.all(sql, [], (err, rows) => {
			if (err) {
				throw err;
			}
			r = rows;
			
		});
		r.forEach((datum) => {
			console.log(datum);
		})
        socket.emit('update', r);

    }, 10000);
});


http.listen(3000, function(){
	console.log('listening on *:3000');
});
