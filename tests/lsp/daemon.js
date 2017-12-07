"use strict";

const { spawn } = require('child_process');
const rpc = require('vscode-jsonrpc');
var path = require('path');

var assert = require('assert');
var cwd = process.cwd();
var request = require('./requests/request');

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

function projectUri() {
    if (!state.gaugeDaemon)
        throw ("Gauge Daemon not initialized");
    return state.projectPath.replace(":", "%3A");
}

function projectPath() {
    if (!state.gaugeDaemon)
        throw ("Gauge Daemon not initialized");
    return state.projectPath;
}

function handle(handler, done) {
    if (!state.gaugeDaemon)
        throw ("Gauge Daemon not initialized");
    if (!state.reader)
        throw ("Gauge Daemon Stream reader not available")
    state.reader.listen(async (data) => await responseHandler(handler,data,done));
}

async function responseHandler(handler,data,done){
    await handler(data).catch((e) => { done(e) })
    done();
}

module.exports = {
    startGaugeDaemon: startGaugeDaemon,
    handle: handle,
    connection: connection,
    projectUri: projectUri,
    projectPath: projectPath
};
