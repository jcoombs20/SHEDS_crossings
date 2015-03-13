var io = require('socket.io');
var express = require('express');

var app = express()
  , server = require('http').createServer(app)
  , io = io.listen(server);

app.use(express.bodyParser());

server.listen(3411);

io.sockets.on('connection', function (socket) {

	socket.on('get_tables', function (input) {
		console.log("");
		console.log("Getting table names from sheds postgresql database");

		var pg = require('pg');

	
		var conString = 'postgres://Jason:Jason20!@localhost:5432/SHEDS';
	
		var tmpQuery = "SELECT table_name a FROM information_schema.tables WHERE table_schema='sheds' ORDER BY a;";
		console.log(tmpQuery);

		var client = new pg.Client(conString);
		client.connect(function(err) {
			if(err) {
				console.error('could not connect to postgres', err);
				socket.emit('error', {'error': err});
				}
			client.query(tmpQuery, function(err, result) {
				if(err) {
					console.error('error running query', err);
					socket.emit('error', {'error': err});
					}
				var tmpData = result.rows;
				client.end();

				console.log("Successfully retrieved table names");
				socket.emit('get_tables', tmpData);
				});
			});
		});

	socket.on('get_columns', function (input) {
		var layer = input.layer;
		console.log("");
		console.log("Getting table names from sheds postgresql database");

		var pg = require('pg');

	
		var conString = 'postgres://Jason:Jason20!@localhost:5432/SHEDS';
	
		var tmpQuery = "select column_name a, data_type b from information_schema.columns where table_name='" + layer + "' ORDER BY a;";
		console.log(tmpQuery);

		var client = new pg.Client(conString);
		client.connect(function(err) {
			if(err) {
				console.error('could not connect to postgres', err);
				socket.emit('error', {'error': err});
				}
			client.query(tmpQuery, function(err, result) {
				if(err) {
					console.error('error running query', err);
					socket.emit('error', {'error': err});
					}
				var tmpData = result.rows;
				client.end();

				console.log("Successfully retrieved column names");
				socket.emit('get_columns', tmpData);
				});
			});
		});

	socket.on('get_data', function (input) {
		var layer = input.layer;
		var column = input.column;
		var type = input.type;

		console.log("");
		console.log("Getting data from column " + column + " in layer " + layer);

		var pg = require('pg');

	
		var conString = 'postgres://Jason:Jason20!@localhost:5432/SHEDS';
	
		if ( type == "character") {
			var tmpQuery = "SELECT " + layer + "." + column + " a, count(*) b FROM sheds." + layer + " GROUP BY a ORDER BY a;";
			}
		else {
			var tmpQuery = "SELECT " + layer + "." + column + " a FROM sheds." + layer + " ORDER BY a;";
			}
		console.log(tmpQuery);

		var client = new pg.Client(conString);
		client.connect(function(err) {
			if(err) {
				console.error('could not connect to postgres', err);
				socket.emit('error', {'error': err});
				}
			client.query(tmpQuery, function(err, result) {
				if(err) {
					console.error('error running query', err);
					socket.emit('error', {'error': err});
					}
				var tmpData = result.rows;
				client.end();

				console.log("Successfully retrieved data");
				socket.emit('get_data', tmpData);
				});
			});
		});

	socket.on('disconnect', function () {
    		socket.emit('disconnect');
 		});
	});

