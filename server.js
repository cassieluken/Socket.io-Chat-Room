//app.js
var PORT = process.env.PORT || 8000;
var moment = require('moment');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const Chat = require('./message.model');
require('./dbconnect');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:8000/"


app.use(express.static(__dirname + '/public'));

var clientInfo = {};

function getHistory(){
	app.get('/getusers',async(req,res)=>{
		//res.send used for larger more intense queries?
		/* collection.find().toArray().then(result=>{
			console.log('display user')
			res.send(result)
		}) */
		//callback - res.json used for smaller queries with json
		/* UserModel.find().then(results=>{
			res.json(results)
		}) */
		//await async
		const results = await UserModel.find()
		res.json(results)
	})
}

// Sends current users to provided socket
function sendCurrentUsers (socket) {
	var info = clientInfo[socket.id];
	var users = [];

	if (typeof info === 'undefined') {
		return;
	}

	Object.keys(clientInfo).forEach(function (socketId) {
		var userInfo = clientInfo[socketId];

		if (info.room === userInfo.room) {
			users.push(userInfo.name);
		}
	});

	socket.emit('message', {
		name: 'System',
		text: 'Current users: ' + users.join(', '),
		timestamp: moment().valueOf()
	});
}

io.on('connection', function (socket) {
	console.log('User connected via socket.io!');

	socket.on('disconnect', function () {
		var userData = clientInfo[socket.id];

		if (typeof userData !== 'undefined') {
			socket.leave(userData.room);
			io.to(userData.room).emit('message', {
				name: 'System',
				text: userData.name + ' has left!',
				timestamp: moment().valueOf()
			});
			delete clientInfo[socket.id];
		}
	});

	socket.on('joinRoom', function (req) {
		clientInfo[socket.id] = req;
		socket.join(req.room);
		socket.broadcast.to(req.room).emit('message', {
			name: 'System',
			text: req.name + ' has joined!',
			timestamp: moment().valueOf()
		});
	});

	socket.on('message', function (message) {
		console.log('Message received: ' + message.text);
		//do some kind of db op save msg 
		message.timestamp = moment().valueOf();
		console.log(message)
		let chatMsg = new Chat(message);
		chatMsg.save().then(()=>{
			if (message.text === '@currentUsers') {
				sendCurrentUsers(socket);
			} else {
				io.to(clientInfo[socket.id].room).emit('message', message);	
			}
		})
	});

	// timestamp property - JavaScript timestamp (milliseconds)

	socket.emit('message', {
		name: 'System',
		text: 'You have joined the room...',
		timestamp: moment().valueOf(),
	});
});

http.listen(PORT, function () {
	console.log('Server started!');
});