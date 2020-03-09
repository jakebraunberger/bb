var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var express = require('express');
const sqlite3 = require('sqlite3').verbose();

app.use(express.static(__dirname));

let db = new sqlite3.Database('./display.db');
let sql = `SELECT * from DISPLAY order by time asc limit 1`;


// initially get the data
var r = [];
db.all(sql, [], (err, rows) => {
	if (err) {
		throw err;
	}
	r = rows[0];
});

// then need to get the data later
var out = {
	status: {
		value: r.STATUS
	},
	voltages: {
      battery_voltage: r.CC0,
      array_voltage: r.CC1,
      load_voltage: r.CC2,
    },
    currents: {
      charge_current: r.CC3,
      load_current: r.CC4,
    },
    battery: {
      charge_w: r.CC5,
      daily_ahc: r.CC6,
      daily_ahl: r.CC7,
      charge_kwh: r.CC8,
      daily_vb_min: r.CC9,
      charge_state: r.CC10,          
    },
    cc: {
          cc_led_state: r.CC11,
          cc_load_state: r.MCC0,
    },
    jam_sequence: {
      jam_sequence: r.MCC1,
    },
    mcc: {
      mcc_sn: r.MCC2,
      mcc_rpm: r.MCC3,
      mcc_status: r.MCC4,
      mcc_voltage: r.MCC5,
      mcc_current: r.MCC6,
      mcc_temp: r.MCC7,
    }
};


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

const chartArray = [];

sql = `SELECT * from DISPLAY order by id desc limit 1`;

io.on('connection', (socket) => {
	
    console.log('go.'); 
    io.emit('go');

    

    setInterval(function() {
        r = [];
        
        db.all(sql, [], (err, rows) => {
			if (err) {
				throw err;
			}

			r = rows[0];
			console.log(r);

		out = {
			status: {
				value: r.STATUS
			},
			voltages: {
		      battery_voltage: r.CC0,
		      array_voltage: r.CC1,
		      load_voltage: r.CC2,
		    },
		    currents: {
		      charge_current: r.CC3,
		      load_current: r.CC4,
		    },
		    battery: {
		      charge_w: r.CC5,
		      daily_ahc: r.CC6,
		      daily_ahl: r.CC7,
		      charge_kwh: r.CC8,
		      daily_vb_min: r.CC9,
		      charge_state: r.CC10,          
		    },
		    cc: {
		          cc_led_state: r.CC11,
		          cc_load_state: r.MCC0,
		    },
		    jam_sequence: {
		      jam_sequence: r.MCC1,
		    },
		    mcc: {
		      mcc_sn: r.MCC2,
		      mcc_rpm: r.MCC3,
		      mcc_status: r.MCC4,
		      mcc_voltage: r.MCC5,
		      mcc_current: r.MCC6,
		      mcc_temp: r.MCC7,
		    }
		};
		socket.emit('update', out);	
		});
		
        console.log('Update.\n');

    }, 5000);
});


http.listen(8080, function(){
	console.log('listening on *:8080');
});
