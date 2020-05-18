'use strict';
const express = require("express");
const bodyParser = require('body-parser');
const WebSocket = require("ws");
const {Config, Hash, Block, BlockChain, Socket, MessageType, ResponseMessage} = require('./models')

//Socket

var connectToNodes = (newNodes) => {
    newNodes.forEach((node) => {
        var ws = new WebSocket(node);
        ws.on('open', () => {
            initConnection(ws);
            responseMsj = ResponseMessage.NEW_NODE_SUCCESSFUL;
        });
        ws.on('error', () => {
            console.log('Falló conexión')
            responseMsj = ResponseMessage.NEW_NODE_FAILURE;
        });
    });
};

var initConnection = (ws) => {
    s.lstSockets.push(ws);
    initMessageHandler(ws);
    initErrorHandler(ws);
    Socket.write(ws, queryChainLengthMsg());
};

var initMessageHandler = (ws) => {
    console.log("ws " + ws);
    ws.on('message', (data) => {
        var message = JSON.parse(data);
        console.log('Received message' + JSON.stringify(message));
        switch (message.type) {
            case MessageType.QUERY_LATEST:
                Socket.write(ws, responseLatestMsg());
                break;
            case MessageType.QUERY_ALL:
                Socket.write(ws, responseChainMsg());
                break;
            case MessageType.RESPONSE_BLOCKCHAIN:
                handleBlockchainResponse(message);
                break;
        }
    });
};

var initErrorHandler = (ws) => {
    var closeConnection = (ws) => {
        console.log('Falló conexión a nodo: ' + ws.url);
        s.lstSockets.splice(s.lstSockets.indexOf(ws), 1);
    };
    ws.on('close', () => closeConnection(ws));
    ws.on('error', () => closeConnection(ws));
};

var handleBlockchainResponse = (message) => {
    var receivedBlocks = JSON.parse(message.data).sort((b1, b2) => (b1.index - b2.index));
    var latestBlockReceived = receivedBlocks[receivedBlocks.length - 1];
    var latestBlockHeld = blockChain.lastBlockInChain();
    if (latestBlockReceived.index > latestBlockHeld.index) {
        console.log('La cadena puede estar desactualizada. Local: ' + latestBlockHeld.index + ' Versión nodo: ' + latestBlockReceived.index);
        if (latestBlockHeld.hash === latestBlockReceived.previousHash) {
            console.log("Añade block a cadena local");
            blockChain.chain.push(latestBlockReceived);
            s.broadcast(responseLatestMsg());
        } else if (receivedBlocks.length === 1) {
            console.log("Enviar cadena de nodo local");
            s.broadcast(queryAllMsg());
        } else {
            console.log("Reemplazar cadena, la recibida es más larga");
            replaceChain(receivedBlocks);
        }
    } else {
        console.log('La cadena recibida es más corta. Sin acciones');
    }
};

var replaceChain = (newBlocks) => {
    if (isValidChain(newBlocks) && newBlocks.length > blockChain.chain.length) {
        console.log('Cadena recibida válida. Reemplazando cadena');
        blockChain.chain = newBlocks;
        s.broadcast(responseLatestMsg());
    } else {
        console.log('Cadena recibida inválida');
    }
};

var isValidChain = (blockchainToValidate) => {
    if (JSON.stringify(blockchainToValidate[0]) !== JSON.stringify(Block.initialBlock())) {
        return false;
    }
    for (var i = 1; i < blockchainToValidate.length; i++) {
        if (!blockchainToValidate[i].isValid(blockchainToValidate[i - 1])) {
            return false;
        }
    }
    return true;
};

var initP2PServer = () => {
    var server = new WebSocket.Server({port: config.p2p_port});
    server.on('connection', ws => initConnection(ws));
    console.log('Conexión p2p en puerto: ' + config.p2p_port);

};

//Server Http

var initHttpServer = () => {
    var app = express();
    app.use(bodyParser.json());

    app.get('/blocks', (req, res) => res.send(JSON.stringify(blockChain.chain)));
    app.post('/mineBlock', (req, res) => {
        var newBlock = Block.generateBlock(req.body.data, blockChain.lastBlockInChain());
        blockChain.addBlock(newBlock);
        s.broadcast(responseLatestMsg());
        res.send(responseMsj);
    });
   app.get('/nodes', (req, res) => {
        res.send(s.lstSockets.map(s => s._socket.remoteAddress + ':' + s._socket.remotePort));
    });
    app.post('/addNode', (req, res) => {
        connectToNodes([req.body.peer]);
        res.send(responseMsj);
    });
    app.listen(config.server_port, () => console.log('Servidor HTTP en puerto: ' + config.server_port));
};


var responseMsj = "";
var config = new Config();
var blockChain = new BlockChain();
var s = new Socket();
var queryChainLengthMsg = () => ({'type': MessageType.QUERY_LATEST});
var queryAllMsg = () => ({'type': MessageType.QUERY_ALL});
var responseChainMsg = () =>({
    'type': MessageType.RESPONSE_BLOCKCHAIN, 'data': JSON.stringify(blockChain.chain)
});
var responseLatestMsg = () => ({
    'type': MessageType.RESPONSE_BLOCKCHAIN,
    'data': JSON.stringify([blockChain.lastBlockInChain()])
});

connectToNodes(config.initialNodes);
initHttpServer();
initP2PServer();