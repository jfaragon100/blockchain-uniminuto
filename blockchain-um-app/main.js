var CryptoJS = require("crypto-js");
var express = require("express");
var bodyParser = require('body-parser');

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
    constructor (id, name, title, half) {
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
            return false;
        } else if (lastBlock.hash !== this.previousHash) {
            console.log('invalid previoushash');
            return false;
        } else if (Hash.calculateForBlock(this) !== this.hash) {
            console.log(typeof (this.hash) + ' ' + typeof Hash.calculateForBlock(this));
            console.log('invalid hash: ' + Hash.calculateForBlock(this) + ' ' + this.hash);
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
        }
    }
}

class Sockets {
    constructor () {
        this.lstSockets = [];
    }
}

const MessageType = Object.freeze({
    "QUERY_LATEST": 0,
    "QUERY_ALL": 1,
    "RESPONSE_BLOCKCHAIN": 2
});

//Socket

var connectToNodes = (newNodes) => {
    newNodes.forEach((node) => {
        initConnection(node);
    });
};

var initConnection = (ws) => {
    s.lstSockets.push(ws);
};

//Server

var initHttpServer = () => {
    var app = express();
    app.use(bodyParser.json());

    app.get('/blocks', (req, res) => res.send(JSON.stringify(blockChain.chain)));
    app.post('/mineBlock', (req, res) => {
        var newBlock = Block.generateBlock(req.body.data);
        console.log(req.body.data);
        blockChain.addBlock(newBlock);
        console.log('block added: ' + JSON.stringify(newBlock));
        res.send();
    });
   app.get('/nodes', (req, res) => {
        res.send(res.send(JSON.stringify(s.lstSockets)));
    });
    app.post('/addNode', (req, res) => {
        connectToNodes([req.body.peer]);
        res.send();
    });
    app.listen(config.server_port, () => console.log('Listening http on port: ' + config.server_port));
};



var config = new Config();
var blockChain = new BlockChain();
var s = new Sockets();
initHttpServer();