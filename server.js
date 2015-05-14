//server.js

// For todays date;
Date.prototype.today = function () { 
    return ((this.getDate() < 10)?"0":"") + this.getDate() +"/"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"/"+ this.getFullYear();
}

// For the time now
Date.prototype.timeNow = function () {
     return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
}

var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({port: 8080})
  , connections = [];

wss.on('connection', function(ws) {
    connections.push(ws);

    ws.on('message', function(m) {
//        console.log(m);
        var message = JSON.parse(m);
        if(message.type == 'register'){
            console.log(JSON.stringify(message));
            ws.name = message.name;
            var time = new Date().timeNow();
            if(connections.length > 1) {
                ws.send("There are " + (connections.length-1) + " people logged on");
            }
            connections.forEach(function(connection, index) {
                connection.send(time + " " + ws.name + " has logged on");
            });   
        } else {
            console.log('\"' + message.text +'\" received from connection ' + connections.indexOf(ws));
            var time = new Date().timeNow();
            connections.forEach(function(connection, index) {
                console.log('\"' + message.text +'\" send to ' + index);
                connection.send(time + " " + ws.name + " says:  " + message.text);
            });
        }
    });

    ws.on('close', function() {
    	connections.splice(connections.indexOf(ws), 1);
        var time = new Date().timeNow();
        connections.forEach(function(connection, index) {
            connection.send(time + " : " + ws.name + " has logged off");
        });   
    	console.log('There are ' + connections.length + ' connections still alive');
    });
});

console.log('WebSocketServer Up')