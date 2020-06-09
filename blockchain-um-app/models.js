'use strict';

const CryptoJS = require("crypto-js");

class Config {
    constructor () {
        this.server_port = process.env.SERVER_PORT || 8080;
        this.p2p_port = process.env.P2P_PORT || 6001;
        this.initialNodes = process.env.NODES ? process.env.NODES.split(',') : [];
    }
}

exports.Config = Config

class Hash {

    static calculate (index, previousHash, timestamp, data) {
        return CryptoJS.SHA256(index + previousHash + timestamp + data).toString();
    };

    static calculateForBlock (block) {
        return this.calculate(block.index, block.previousHash, block.timestamp, block.data);
    };

}
exports.Hash = Hash

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

    static toBlock (newBlock) {
        return Object.assign(this, newBlock)
    }

    static initialBlock () {
        var student = {
            name: 'John the First',
            title: 'Tecnología en Redes y Seguridad Informática',
            half: 6
        };
        return new Block(0, "0", 1465154705, student, "816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7");
    }

    static generateBlock (blockData, lastBlock) {
        var nextIndex = lastBlock.index + 1;
        var nextTimestamp = new Date().getTime() / 1000;
        var nextHash = Hash.calculate(nextIndex, lastBlock.hash, nextTimestamp, blockData);
        return new Block(nextIndex, lastBlock.hash, nextTimestamp, blockData, nextHash);
    }

    isValid (lastBlock) {
        if (lastBlock.index + 1 !== this.index) {
            console.log('\n\n' + ResponseMessage.NEW_BLOCK_INVALID_INDEX);
            //responseMsj = ResponseMessage.NEW_BLOCK_INVALID_INDEX;
            return false;
        } else if (lastBlock.hash !== this.previousHash) {
            console.log('\n\n' + ResponseMessage.NEW_BLOCK_INVALID_PREVIOUS_HASH);
            //responseMsj = ResponseMessage.NEW_BLOCK_INVALID_PREVIOUS_HASH;
            return false;
        } else if (Hash.calculateForBlock(this) !== this.hash) {
            console.log('\n\n ' + ResponseMessage.NEW_BLOCK_INVALID_PREVIOUS_HASH + Hash.calculateForBlock(this) + ' ' + this.hash);
            //responseMsj = ResponseMessage.NEW_BLOCK_INVALID_HASH;
            return false;
        }
        return true;
    }
}

exports.Block = Block

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
            console.log('\n\n' + ResponseMessage.NEW_BLOCK_SUCCESSFUL + JSON.stringify(newBlock));
            //responseMsj = ResponseMessage.NEW_BLOCK_SUCCESSFUL;
        }
    }
}

exports.BlockChain = BlockChain

class Socket {
    constructor () {
        this.lstSockets = [];
    }

    static write (ws, message) {
        ws.send(JSON.stringify(message));
    }
    
    broadcast (message) {
        this.lstSockets.forEach(socket => {
            Socket.write(socket, message);
        });
    }
}

exports.Socket = Socket

const MessageType = Object.freeze({
    "QUERY_LATEST": 0,
    "QUERY_ALL": 1,
    "RESPONSE_BLOCKCHAIN": 2
});

exports.MessageType = MessageType

const ResponseMessage = Object.freeze({
    "NEW_BLOCK_SUCCESSFUL": "Nuevo bloque en cadena",
    "NEW_BLOCK_INVALID_INDEX": "No se añadió bloque: index inválido",
    "NEW_BLOCK_INVALID_HASH": "No se añadió bloque: hash inválido",
    "NEW_BLOCK_INVALID_PREVIOUS_HASH": "No se añadió bloque: hash previo inválido",
    "NEW_NODE_SUCCESSFUL": "Nueva conexión a nodo",
    "NEW_NODE_FAILURE": "Falló conexión a nodo"
});

exports.ResponseMessage = ResponseMessage

const Messages = Object.freeze({
    "queryChainLengthMsg": () => ({'type': MessageType.QUERY_LATEST}),
    "queryAllMsg": () => ({'type': MessageType.QUERY_ALL}),
    "responseChainMsg": (data) =>({
        'type': MessageType.RESPONSE_BLOCKCHAIN, 'data': JSON.stringify(data)
    })
});

exports.Messages = Messages;