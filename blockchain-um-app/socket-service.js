'use strict';

const WebSocket = require("ws");
const {Socket, Messages, MessageType} = require('./models')

class ConnectionSocket {
    static connectToNodes (newNodes, blockChain, s) {
        newNodes.forEach((node) => {
            var ws = new WebSocket(node);
            ws.on('open', () => {
                this.initConnection(blockChain, s, ws);
                //responseMsj = ResponseMessage.NEW_NODE_SUCCESSFUL;
            });
            ws.on('error', () => {
                console.log('Falló conexión')
                //responseMsj = ResponseMessage.NEW_NODE_FAILURE;
            });
        });
    };
    
    static initConnection (blockChain, s, ws) {
        s.lstSockets.push(ws);
        this.initMessageHandler(ws, blockChain, s);
        this.initErrorHandler(ws, s);
        Socket.write(ws, Messages.queryChainLengthMsg());
    };
    
    static initMessageHandler (ws, blockChain, s) {
        ws.on('message', (data) => {
            var message = JSON.parse(data);
            console.log('Mensaje recibido ' + JSON.stringify(message));
            switch (message.type) {
                case MessageType.QUERY_LATEST:
                    Socket.write(ws, Messages.responseChainMsg([blockChain.lastBlockInChain()]));
                    break;
                case MessageType.QUERY_ALL:
                    Socket.write(ws, Messages.responseChainMsg(blockChain.chain));
                    break;
                case MessageType.RESPONSE_BLOCKCHAIN:
                    this.handleBlockchainResponse(message, blockChain, s);
                    break;
            }
        });
    };
    
    static initErrorHandler (ws, s) {
        var closeConnection = (ws) => {
            console.log('Falló conexión a nodo: ' + ws.url);
            s.lstSockets.splice(s.lstSockets.indexOf(ws), 1);
        };
        ws.on('close', () => closeConnection(ws));
        ws.on('error', () => closeConnection(ws));
    };
    
    static handleBlockchainResponse (message, blockChain, s) {
        var receivedBlocksArray = JSON.parse(message.data).sort((b1, b2) => (b1.index - b2.index));
        var latestBlockReceived = receivedBlocksArray[receivedBlocksArray.length - 1];
        var latestBlockHeld = blockChain.lastBlockInChain();
        console.log("latestBlockReceived.index " + latestBlockReceived.index + " latestBlockHeld.index " + latestBlockHeld.index);
        if (latestBlockReceived.index > latestBlockHeld.index) {
            console.log('La cadena puede estar desactualizada. Local: ' + latestBlockHeld.index + ' Versión nodo: ' + latestBlockReceived.index);
            if (latestBlockHeld.hash === latestBlockReceived.previousHash) {
                console.log("Añade block a cadena local");
                blockChain.chain.push(latestBlockReceived);
                s.broadcast(Messages.responseChainMsg([blockChain.lastBlockInChain()]));
            } else if (receivedBlocksArray.length === 1) {
                console.log("Enviar cadena de nodo local");
                s.broadcast(Messages.queryAllMsg());
            } else {
                console.log("Reemplazar cadena, la recibida es más larga");
                this.replaceChain(receivedBlocksArray, blockChain, s);
            }
        } else {
            console.log('La cadena recibida es más corta. Sin acciones');
        }
    };
    
    static replaceChain (newBlocks, blockChain, s) {
        if (this.isValidChain(newBlocks) && newBlocks.length > blockChain.chain.length) {
            console.log('Cadena recibida válida. Reemplazando cadena');
            blockChain.chain = newBlocks;
            s.broadcast(Messages.responseChainMsg([blockChain.lastBlockInChain()]));
        } else {
            console.log('Cadena recibida inválida');
        }
    };
    
    static isValidChain (blockchainToValidate) {
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
    
    static initP2PServer (port, blockChain, s) {
        var server = new WebSocket.Server({port: port});
        server.on('connection', ws => this.initConnection(blockChain, s, ws));
        console.log('Conexión p2p en puerto: ' + port);
    
    };
}

exports.ConnectionSocket = ConnectionSocket