'use strict';

const {Config, BlockChain, Socket} = require('./models')
const {ServerHTTP} = require("./server-service")
const {ConnectionSocket} = require("./socket-service");
const find = require('local-devices');

// IP del cluster
find()
    .then(devices => {
        //var responseMsj = "";

        var config = new Config();
        config.initialNodes = devices.map(d => "ws://"+d.ip+":"+config.p2p_port);
        var blockChain = new BlockChain();
        var s = new Socket();


        ConnectionSocket.connectToNodes(config.initialNodes, blockChain, s);
        ServerHTTP.initHttpServer(blockChain, s, config.server_port);
        ConnectionSocket.initP2PServer(config.p2p_port, blockChain, s);
    })
    .catch(error => {
        console.log('\n\nError en el cluster ' + error)
    });