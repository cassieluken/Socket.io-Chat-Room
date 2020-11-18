//chat.js
//
var name = getQueryVariable('name') || 'Anonymous';
var room = getQueryVariable('room');
var socket = io();

console.log(name + ' wants to join ' + room);

// Update h1 tag
jQuery('.room-title').text(room);
jQuery('.your-name').text('Welcome '+name);

socket.on('connect', function () {
	console.log('Conncted to socket.io server!');
	socket.emit('joinRoom', {
		name: name,
		room: room
	});
});

socket.on('message', function (message) {
	var momentTimestamp = moment.utc(message.timestamp);
	var $messages = jQuery('.messages');
	
	var $message = jQuery(`<li class="list-group-item ${message.name === name? 'text-right':''}"></li>`);
	console.log('New message:');
	console.log(message.text);
		
	$message.append(`<p><strong> ${message.name === name? 'You':message.name}` + ' ' + momentTimestamp.local().format('h:mm a') + '</strong></p>');
	$message.append('<p>' + message.text + '</p>');
	$messages.append($message);
		
});

// Handles submitting of new message
var $form = jQuery('#message-form');

$form.on('submit', function (event) {
	event.preventDefault();

	var $message = $form.find('input[name=message]');

	socket.emit('message', {
		name: name,
		text: $message.val(),
		room: room
	});

	$message.val('');
});

