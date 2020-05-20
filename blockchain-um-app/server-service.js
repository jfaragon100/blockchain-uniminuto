'use strict';

var express = require("express");
var bodyParser = require('body-parser');
const {Block, Messages} = require('./models')
const {ConnectionSocket} = require("./socket-service");

class ServerHTTP {
    static initHttpServer (blockChain, s, port) {
        var app = express();
        app.use(bodyParser.json());
    
        app.get('/blocks', (req, res) => res.send(JSON.stringify(blockChain.chain)));
        app.post('/mineBlock', (req, res) => {
            var newBlock = Block.generateBlock(req.body.data, blockChain.lastBlockInChain());
            blockChain.addBlock(newBlock);
            s.broadcast(Messages.responseChainMsg([blockChain.lastBlockInChain()]));
            res.send();
        });
       app.get('/nodes', (req, res) => {
            res.send(s.lstSockets.map(s => s._socket.remoteAddress + ':' + s._socket.remotePort));
        });
        app.post('/addNode', (req, res) => {
            ConnectionSocket.connectToNodes([req.body.node], blockChain, s);
            res.send();
        });
        app.listen(port, () => console.log('\n\nServidor HTTP en puerto: ' + port));
    };
}

exports.ServerHTTP = ServerHTTP