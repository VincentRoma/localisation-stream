// modules =================================================
var WebSocketServer = require('ws').Server
var http = require('http');
var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var cors = require('cors');


// configuration ===========================================

// config files
var port = process.argv.port || 8383; // set our port

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/location';


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

var insertDocument = function(db, data, callback) {
  // Get the documents collection
  var collection = db.collection('position');
  // Insert some documents
  collection.insert([
	  data
  ], function(err, result) {
    console.log("Inserted documents into the collection");
    callback(result);
  });
}


app.post('/position',function(req, res){
	MongoClient.connect(url, function(err, db) {
	  insertDocument(db, req.body, function() {
	    db.close();
	  });
	});
    wss.broadcast(JSON.stringify(req.body));
    res.sendStatus(200);
});
app.server.listen(port);

console.log('Server running on ' + port); 			// shoutout to the user
exports = module.exports = app; 						// expose app
