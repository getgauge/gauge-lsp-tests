"use strict";
const rpc = require('vscode-jsonrpc');
const vscodeUri = require('vscode-uri').default;
const file = require('../util/fileExtension')
const _request = require('./request')
const _notification = require('./notfication')

var state = {}
var listeners = [];
var listenerId = 0;

async function shutDown(){
    await state.connection.sendRequest(new rpc.RequestType("shutdown"), undefined)
    _notification.sendNotification(state.connection, "exit");
}

async function codeLens(fileUri, connection) {
    return await _request.request(fileUri,connection,'textDocument/codeLens')    
}
  
async function codecomplete(position, fileUri, connection) {
    return await _request.request(fileUri,connection,'textDocument/completion',position)
}
  
async function gotoDefinition(position, fileUri, connection) {
    return await _request.request(fileUri,connection,'textDocument/definition',position)
}
  
async function formatFile(fileUri, connection) {  
    return await _request.request(fileUri,connection,'textDocument/formatting',null,{
        "tabSize":4,
        "insertSpaces":true
    })  
}
  

async function openFile(filePath,content, connection) {
    return await _notification.sendNotification(state.connection,'textDocument/didOpen',
    {
        "textDocument":
        {
            "uri": file.getUri(filePath),
            "languageId": "markdown",
            "version": 1,
            "text": content
        }
    });
}  

async function initialize(process,execPath){
    var connection = getConnection(process)

    const initializeParams = getInitializeParams(execPath, process);    
    
    await connection.sendRequest(new rpc.RequestType("initialize"), initializeParams, null);
    connection.onRequest(new rpc.RequestType("client/registerCapability"), () => {});

    await _notification.OnNotification("textDocument/publishDiagnostics",connection,listeners)    
    await _notification.sendNotification(connection, "initialized",{})
    state.connection = connection
    return connection
}

function getConnection(process){
    var reader = new rpc.StreamMessageReader(process.stdout);
    var writer = new rpc.StreamMessageWriter(process.stdin);

    let connection = rpc.createMessageConnection(reader, writer);
    connection = connection;

    connection.listen();
    return connection;
}

// Return the parameters used to initialize a client - you may want to extend capabilities
function getInitializeParams(projectPath,process) {
    return {
        processId: process.pid,
        rootPath: projectPath,
        rootUri: vscodeUri.file(projectPath).toString(),
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

function registerForNotification(listener,expectedDiagnostics,verifyIfDone,done){
    var id = listenerId
    listeners.push({id:listenerId, listener:listener, expectedDiagnostics:expectedDiagnostics,verifyIfDone:verifyIfDone,done:done})
    listenerId++
    return id
}
    
module.exports = {
    initialize:initialize,
    registerForNotification:registerForNotification,
    shutDown:shutDown,
    openFile:openFile,
    codeLens:codeLens,
    codecomplete:codecomplete,
    gotoDefinition:gotoDefinition,
    formatFile:formatFile
}
