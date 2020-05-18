var express = require("express");
var bodyParser = require('body-parser');
var model = require('./models');

var initHttpServer = () => {
    var app = express();
    app.use(bodyParser.json());

    app.get('/blocks', (req, res) => res.send(JSON.stringify(model.Blockchain.chain)));
    /*app.post('/mineBlock', (req, res) => {
        var newBlock = model.Block.generateBlock(req.body.data);
        addBlock(newBlock);
        broadcast(responseLatestMsg());
        console.log('block added: ' + JSON.stringify(newBlock));
        res.send();
    });
    app.get('/peers', (req, res) => {
        res.send(sockets.map(s => s._socket.remoteAddress + ':' + s._socket.remotePort));
    });
    app.post('/addPeer', (req, res) => {
        connectToPeers([req.body.peer]);
        res.send();
    });*/
    app.listen(http_port, () => console.log('Listening http on port: ' + http_port));
};