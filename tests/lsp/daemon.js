"use strict";

const { spawn } = require('child_process');
const rpc = require('vscode-jsonrpc');
const vscodeUri = require('vscode-uri').default;
var path = require('path');

var assert = require('assert');
var request = require('./request');
var file = require('../util/fileExtension')
var state = {}
var listeners = []
var listenerId = 0;

async function startGaugeDaemon(projectPath,listener,expectedDiagnostics,verifyIfDone,done) {
    state.projectPath = file.getFullPath(projectPath);
    state.gaugeDaemon = spawn('gauge', ['daemon', '--lsp', '--dir=' + state.projectPath, "-l", "debug"],{cwd:state.projectPath});
    state.reader = new rpc.StreamMessageReader(state.gaugeDaemon.stdout);
    state.writer = new rpc.StreamMessageWriter(state.gaugeDaemon.stdin);

    let connection = rpc.createMessageConnection(state.reader, state.writer);    
    connection.listen();
    await connection.sendRequest(new rpc.RequestType("initialize"), { "processId": process.pid, "rootPath": state.projectPath, "rootUri": vscodeUri.file(state.projectPath).toString(), "capabilities": { "workspace": { "applyEdit": true, "didChangeConfiguration": { "dynamicRegistration": true }, "didChangeWatchedFiles": { "dynamicRegistration": true }, "symbol": { "dynamicRegistration": true }, "executeCommand": { "dynamicRegistration": true } }, "textDocument": { "synchronization": { "dynamicRegistration": true, "willSave": true, "willSaveWaitUntil": true, "didSave": true }, "completion": { "dynamicRegistration": true, "completionItem": { "snippetSupport": true, "commitCharactersSupport": true } }, "hover": { "dynamicRegistration": true }, "signatureHelp": { "dynamicRegistration": true }, "definition": { "dynamicRegistration": true }, "references": { "dynamicRegistration": true }, "documentHighlight": { "dynamicRegistration": true }, "documentSymbol": { "dynamicRegistration": true }, "codeAction": { "dynamicRegistration": true }, "codeLens": { "dynamicRegistration": true }, "formatting": { "dynamicRegistration": true }, "rangeFormatting": { "dynamicRegistration": true }, "onTypeFormatting": { "dynamicRegistration": true }, "rename": { "dynamicRegistration": true }, "documentLink": { "dynamicRegistration": true } } }, "trace": "off" }, null);
    connection.onRequest(new rpc.RequestType("client/registerCapability"), () => {});        
    await connection.sendNotification(new rpc.NotificationType("initialized"), {});
    state.connection = connection;

    listenerForPublishDiagnostics()
    if(listener)
        addListenerPublishDiagnostics(listener,expectedDiagnostics,verifyIfDone,done)
};

async function addListenerPublishDiagnostics(listener,expectedDiagnostics,verifyIfDone,done){
    var id = listenerId
    listeners.push({id:listenerId, listener:listener, expectedDiagnostics:expectedDiagnostics,verifyIfDone:verifyIfDone,done:done}) 
    listenerId++
    return id
}    

async function removeListenerPublishDiagnostics(id){
    listeners.pop()
    //todo remove the one that matches the id
}    

async function listenerForPublishDiagnostics(){
    try{
        connection().onNotification("textDocument/publishDiagnostics", (res) => {
          try {
            handlerForDiagnosticResponse(res)
          } catch(e) {
            console.log(e);
          }
        });
    }
    catch(err){
        throw new Error("unable to verify Diagnostics response "+err)        
    }    
}

async function handlerForDiagnosticResponse(res){
    for(var i=0;i<listeners.length;i++){
        listeners[i].listener(res,listeners[i].expectedDiagnostics)
        if(listeners[i].verifyIfDone())
        {
            listeners[i].done()
            removeListenerPublishDiagnostics(listeners[i].id)            
        }
    }
}

async function stopGaugeDaemon(done){
    await state.connection.sendRequest(new rpc.RequestType("shutdown"), undefined)
    state.connection.sendNotification(new rpc.RequestType("exit"));
    state.connection.dispose();
}

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

module.exports = {
    startGaugeDaemon: startGaugeDaemon,
    stopGaugeDaemon:stopGaugeDaemon,
    connection: connection,
    projectPath: projectPath
};
