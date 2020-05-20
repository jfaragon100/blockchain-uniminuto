'use strict';

const WebSocket = require("ws");
const {Block, Socket, Messages, MessageType, ResponseMessage} = require('./models')

class ConnectionSocket {
    static connectToNodes (newNodes, blockChain, s) {
        newNodes.forEach((node) => {
            var ws = new WebSocket(node);
            ws.on('open', () => {
                this.initConnection(blockChain, s, ws);
                console.log('\n\n' + ResponseMessage.NEW_NODE_SUCCESSFUL + ' ' + node)
                //responseMsj = ResponseMessage.NEW_NODE_SUCCESSFUL;
            });
            ws.on('error', () => {
                console.log('\n\n' + ResponseMessage.NEW_NODE_FAILURE + ' ' + node)
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
            console.log('\n\nMensaje recibido ' + JSON.stringify(message));
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
            console.log('\n\nFalló conexión a nodo: ' + ws.url);
            s.lstSockets.splice(s.lstSockets.indexOf(ws), 1);
        };
        ws.on('close', () => closeConnection(ws));
        ws.on('error', () => closeConnection(ws));
    };
    
    static handleBlockchainResponse (message, blockChain, s) {
        var receivedBlocksArray = JSON.parse(message.data).sort((b1, b2) => (b1.index - b2.index));
        var latestBlockReceived = receivedBlocksArray[receivedBlocksArray.length - 1];
        var latestBlockHeld = blockChain.lastBlockInChain();
        console.log("\n\nlatestBlockReceived.index " + latestBlockReceived.index + " latestBlockHeld.index " + latestBlockHeld.index);
        if (latestBlockReceived.index > latestBlockHeld.index) {
            console.log('\n\nLa cadena puede estar desactualizada. Local: ' + latestBlockHeld.index + ' Versión nodo: ' + latestBlockReceived.index);
            if (latestBlockHeld.hash === latestBlockReceived.previousHash) {
                console.log("\n\nAñade block a cadena local");
                blockChain.chain.push(latestBlockReceived);
                s.broadcast(Messages.responseChainMsg([blockChain.lastBlockInChain()]));
            } else if (receivedBlocksArray.length === 1) {
                console.log("\n\nEnviar cadena de nodo local");
                s.broadcast(Messages.queryAllMsg());
            } else {
                console.log("\n\nReemplazar cadena, la recibida es más larga");
                this.replaceChain(receivedBlocksArray, blockChain, s);
            }
        } else {
            console.log('\n\nLa cadena recibida es más corta. Sin acciones');
        }
    };
    
    static replaceChain (newBlocks, blockChain, s) {
        if (this.isValidChain(newBlocks) && newBlocks.length > blockChain.chain.length) {
            console.log('\n\nCadena recibida válida. Reemplazando cadena');
            blockChain.chain = newBlocks;
            s.broadcast(Messages.responseChainMsg([blockChain.lastBlockInChain()]));
        } else {
            console.log('\n\nCadena recibida inválida');
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
        console.log('\n\nConexión p2p en puerto: ' + port);
    
    };
}

exports.ConnectionSocket = ConnectionSocket