"use strict";

const { spawn } = require('child_process');
const rpc = require('vscode-jsonrpc');
var path = require('path');

var assert = require('assert');
var cwd = process.cwd();
var request = require('./request');

var state = {}

async function startGaugeDaemon(projectPath) {
    state.projectPath = path.join(cwd, projectPath);
    state.gaugeDaemon = spawn('gauge', ['daemon', '--lsp', '--dir=' + state.projectPath, "-l", "debug"],{cwd:state.projectPath});
    state.reader = new rpc.StreamMessageReader(state.gaugeDaemon.stdout);
    state.writer = new rpc.StreamMessageWriter(state.gaugeDaemon.stdin);

    let connection = rpc.createMessageConnection(state.reader, state.writer);
    connection.listen();
    state.connection = connection;
};

function connection() {
    if (!state.gaugeDaemon)
        throw ("Gauge Daemon not initialized");
    if (!state.connection)
        throw ("Gauge Daemon connection not available")
    return state.connection;
}

function projectPath() {
    if (!state.gaugeDaemon)
        throw ("Gauge Daemon not initialized");
    return state.projectPath;
}

async function responseHandler(handler,data,done){
    await handler(data).catch((e) => { done(e) })
    done();
}

module.exports = {
    startGaugeDaemon: startGaugeDaemon,
    connection: connection,
    projectPath: projectPath
};
