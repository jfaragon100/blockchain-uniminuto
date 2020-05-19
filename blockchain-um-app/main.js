'use strict';

const {Config, BlockChain, Socket} = require('./models')
const {ServerHTTP} = require("./server-service")
const {ConnectionSocket} = require("./socket-service");

//var responseMsj = "";
var config = new Config();
var blockChain = new BlockChain();
var s = new Socket();

ConnectionSocket.connectToNodes(config.initialNodes, blockChain, s);
ServerHTTP.initHttpServer(blockChain, s, config.server_port);
ConnectionSocket.initP2PServer(config.p2p_port, blockChain, s);