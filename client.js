//client.js
// Uses Jquery...
// http://www.html5rocks.com/en/tutorials/websockets/basics/


function createForm() {
	var f = $('<form><input id="val" placeholder="Enter some data"><input type="submit" value="Submit"></form>')
	return f;
}

window.onload = function() {

	var ws = new WebSocket('ws://localhost:8080');

	ws.onopen =  function() {
		var register = {type: 'register'}
		register.name = prompt('What is your name?');
		ws.send(JSON.stringify(register));
	}

	ws.onmessage = function(e) {
	    $('body').append('<p>' + e.data + '</p>');
	}

	createForm().prependTo('body').submit(function(e) {
		e.preventDefault();
		var v = $('#val').val();
		if(v) {
			var send = {type: 'message', text: v};
			ws.send(JSON.stringify(send));
		}
		$('#val').val('');
	});
}