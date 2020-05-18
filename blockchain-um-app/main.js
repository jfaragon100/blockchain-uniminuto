'use strict';
var CryptoJS = require("crypto-js");
var express = require("express");
var bodyParser = require('body-parser');
var WebSocket = require("ws");

class Config {
    constructor () {
        this.server_port = process.env.SERVER_PORT || 8080;
        this.p2p_port = process.env.P2P_PORT || 6001;
        this.initialNodes = process.env.NODES ? process.env.NODES.split(',') : [];
    }
}

class Hash {

    static calculate (index, previousHash, timestamp, data) {
        return CryptoJS.SHA256(index + previousHash + timestamp + data).toString();
    };

    static calculateForBlock (block) {
        return this.calculate(block.index, block.previousHash, block.timestamp, block.data);
    };

}

class Student {
    constructor (name, title, half) {
        this.name = name;
        this.title = title;
        this.half = half;
    }
}

class Block {
    constructor (index, previousHash, timestamp, student, hash) {
        this.index = index;
        this.previousHash = previousHash.toString();
        this.timestamp = timestamp;
        this.data = new Student(student.name, student.title, student.half);
        this.hash = hash.toString();
    }

    static initialBlock () {
        var student = {
            name: 'John the First',
            title: 'Tecnología en Redes y Seguridad Informática',
            half: 6
        };
        return new Block(0, "0", 1465154705, student, "816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7");
    }

    static generateBlock (blockData) {
        var lastBlock = blockChain.lastBlockInChain();
        var nextIndex = lastBlock.index + 1;
        var nextTimestamp = new Date().getTime() / 1000;
        var nextHash = Hash.calculate(nextIndex, lastBlock.hash, nextTimestamp, blockData);
        return new Block(nextIndex, lastBlock.hash, nextTimestamp, blockData, nextHash);
    }

    isValid (lastBlock) {
        if (lastBlock.index + 1 !== this.index) {
            console.log('invalid index');
            responseMsj = ResponseMessage.NEW_BLOCK_INVALID_INDEX;
            return false;
        } else if (lastBlock.hash !== this.previousHash) {
            console.log('invalid previoushash');
            responseMsj = ResponseMessage.NEW_BLOCK_INVALID_PREVIOUS_HASH;
            return false;
        } else if (Hash.calculateForBlock(this) !== this.hash) {
            console.log('invalid hash: ' + Hash.calculateForBlock(this) + ' ' + this.hash);
            responseMsj = ResponseMessage.NEW_BLOCK_INVALID_HASH;
            return false;
        }
        return true;
    }


}

class BlockChain {
    constructor () {
        this.chain = [Block.initialBlock()];
    }

    lastBlockInChain () { 
        return this.chain[this.chain.length - 1];
    }

    addBlock (newBlock) {
        if (newBlock.isValid(this.lastBlockInChain())) {
            this.chain.push(newBlock);
            responseMsj = ResponseMessage.NEW_BLOCK_SUCCESSFUL;
        }
    }
}

class Socket {
    constructor () {
        this.lstSockets = [];
    }

    static write (ws, message) {
        ws.send(JSON.stringify(message));
    }
    
    broadcast (message) {
        this.lstSockets.forEach(socket => {
            write(socket, message);
        });
    }
}

const MessageType = Object.freeze({
    "QUERY_LATEST": 0,
    "QUERY_ALL": 1,
    "RESPONSE_BLOCKCHAIN": 2
});

const ResponseMessage = Object.freeze({
    "NEW_BLOCK_SUCCESSFUL": "Nuevo bloque en cadena",
    "NEW_BLOCK_INVALID_INDEX": "No se añadió bloque: index inválido",
    "NEW_BLOCK_INVALID_HASH": "No se añadió bloque: hash inválido",
    "NEW_BLOCK_INVALID_PREVIOUS_HASH": "No se añadió bloque: hash previo inválido",
    "NEW_NODE_SUCCESSFUL": "Nueva conexión a nodo",
    "NEW_NODE_FAILURE": "Falló conexión a nodo"
});

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
            blockchain.push(latestBlockReceived);
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
        var newBlock = Block.generateBlock(req.body.data);
        console.log(req.body.data);
        blockChain.addBlock(newBlock);
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