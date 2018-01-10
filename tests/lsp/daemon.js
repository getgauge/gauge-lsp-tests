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
var propertyReader = require('properties-reader');

async function startGaugeDaemonWithLanguage(relativePath,listener,expectedDiagnostics,verifyIfDone,done){
    var properties = propertyReader(file.getFullPath("env/default/user.properties"));
    var property = properties._properties.language;
    
    file.copyFile(path.join("testdata","manifest-"+property+".json"),path.join(relativePath,"manifest.json"))
    await startGaugeDaemon(relativePath,listener,expectedDiagnostics,verifyIfDone,done)
}

// Return the parameters used to initialize a client - you may want to extend capabilities
function getInitializeParams(projectPath,process) {
return {
    processId: process.pid,
    rootPath: projectPath,
    rootUri: vscodeUri.file(state.projectPath).toString(),
    capabilities: { 
    workspace: { 
        applyEdit: true, 
        didChangeConfiguration: { dynamicRegistration: true }, 
        didChangeWatchedFiles: { dynamicRegistration: true }, 
        symbol: { dynamicRegistration: true }, 
        executeCommand: { dynamicRegistration: true } }, 
        textDocument: { 
            synchronization: { dynamicRegistration: true, willSave: true, willSaveWaitUntil: true, didSave: true }, 
            completion: { dynamicRegistration: true, completionItem: { snippetSupport: true, commitCharactersSupport: true } }, 
            hover: { dynamicRegistration: true }, signatureHelp: { dynamicRegistration: true }, 
            definition: { dynamicRegistration: true }, 
            references: { dynamicRegistration: true }, 
            documentHighlight: { dynamicRegistration: true }, documentSymbol: { dynamicRegistration: true }, 
            codeAction: { dynamicRegistration: true }, 
            codeLens: { dynamicRegistration: true }, 
            formatting: { dynamicRegistration: true }, 
            rangeFormatting: { dynamicRegistration: true }, 
            onTypeFormatting: { dynamicRegistration: true }, 
            rename: { dynamicRegistration: true }, 
            documentLink: { dynamicRegistration: true } 
        } 
    },
    trace: "off", 
    experimental: {}
    }
}

async function startGaugeDaemon(projectPath,listener,expectedDiagnostics,verifyIfDone,done) {
    state.projectPath = file.getFullPath(projectPath);
    state.gaugeDaemon = spawn('gauge', ['daemon', '--lsp', '--dir=' + state.projectPath, "-l", "debug"],{cwd:state.projectPath});
    state.reader = new rpc.StreamMessageReader(state.gaugeDaemon.stdout);
    state.writer = new rpc.StreamMessageWriter(state.gaugeDaemon.stdin);

    let connection = rpc.createMessageConnection(state.reader, state.writer);    
    connection.listen();
    const initializeParams = getInitializeParams(state.projectPath, process);

    await connection.sendRequest(new rpc.RequestType("initialize"), initializeParams, null);
    connection.onRequest(new rpc.RequestType("client/registerCapability"), () => {});        
    listenerForPublishDiagnostics(connection)
    if(listener)
    addListenerPublishDiagnostics(listener,expectedDiagnostics,verifyIfDone,done)

    await connection.sendNotification(new rpc.NotificationType("initialized"), {});
    state.connection = connection;

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

async function listenerForPublishDiagnostics(connection){
    try{
        connection.onNotification("textDocument/publishDiagnostics", (res) => {
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
        if(await listeners[i].verifyIfDone())
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
    startGaugeDaemonWithLanguage:startGaugeDaemonWithLanguage,
    startGaugeDaemon: startGaugeDaemon,
    stopGaugeDaemon:stopGaugeDaemon,
    connection: connection,
    projectPath: projectPath
};
