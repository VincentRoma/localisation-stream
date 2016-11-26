// modules =================================================
var WebSocketServer = require('ws').Server
var http = require('http');
var express        = require('express');
var app            = express();
// mongoose       = require('mongoose');
var bodyParser     = require('body-parser');
var cors = require('cors');


// configuration ===========================================

// config files
var port = process.argv.port || 8383; // set our port

// var db = require('./db');

// connect to our mongoDB database (commented out after you enter in your own credentials)
// connectionsubject = mongoose.createConnection(db.urlSubjectViews);

app.use(bodyParser.json({limit: '50mb'})); // parse application/json
app.use(cors());

console.log("[HTTP SERVER] listening on %d", port)

// Creation of WebSocket Server
app.server = http.createServer(app);

wss = new WebSocketServer({"server": app.server});
console.log("[WEBSOCKET SERVER] listening on %d", port)

wss.on("connection", function(ws) {
	var origin = ws.upgradeReq.headers.origin;

	console.log(Date.now().toString() + " [WEBSOCKET]: connection open | "+ origin);

	ws.on("close", function() {
		console.log(Date.now().toString() + " [WEBSOCKET]: connection close | "+ origin);
		//clearInterval(id);
	})
});

// Broadcasting a shared data to every connected Clients
wss.broadcast = function(data){
	console.log(Date.now().toString() + " [WEBSOCKET]: Sending ");
	wss.clients.forEach(function each(client){
		client.send(data);
	});
};
app.post('/position',function(req, res){
    wss.broadcast(JSON.stringify(req.body));
    res.sendStatus(200);
});
app.server.listen(port);

console.log('Server running on ' + port); 			// shoutout to the user
exports = module.exports = app; 						// expose app
