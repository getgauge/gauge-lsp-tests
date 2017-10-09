"use strict";

const { spawn } = require('child_process');
const rpc = require('vscode-jsonrpc');

var assert = require('assert');
var cwd = process.cwd();

async function startGaugeDaemon(store,projectPath){    
    var absProjectPath = cwd+projectPath;    
    const gauge_daemon = spawn('gauge', ['daemon', '--lsp',"--dir="+absProjectPath]);
    var reader = new rpc.StreamMessageReader(gauge_daemon.stdout);
    var writer = new rpc.StreamMessageWriter(gauge_daemon.stdin);

    assert.ok(gauge_daemon.connected,"gauge daemon should be connected")

    let connection = rpc.createMessageConnection(reader,writer);
    connection.listen();

    var uri = absProjectPath.replace(":","%3A")
    store.put("connection", connection);
    store.put("reader",reader);    
    store.put("projectUri", uri);

    console.log(absProjectPath)
};

module.exports = {startGaugeDaemon:startGaugeDaemon};
