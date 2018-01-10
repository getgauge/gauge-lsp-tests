"use strict";
const rpc = require('vscode-jsonrpc');
const vscodeUri = require('vscode-uri').default;
var path = require('path')
const file = require('../util/fileExtension')
const _request = require('./request')

var state = {}
var listeners = []
var listenerId = 0;

async function shutDown(){
    await state.connection.sendRequest(new rpc.RequestType("shutdown"), undefined)
    state.connection.sendNotification(new rpc.RequestType("exit"));
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
    var notification = new rpc.NotificationType('textDocument/didOpen')

    return await state.connection.sendNotification(notification,
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
    var reader = new rpc.StreamMessageReader(process.stdout);
    var writer = new rpc.StreamMessageWriter(process.stdin);

    let connection = rpc.createMessageConnection(reader, writer);
    connection = connection;

    connection.listen();

    const initializeParams = getInitializeParams(execPath, process);    
    await connection.sendRequest(new rpc.RequestType("initialize"), initializeParams, null);
    connection.onRequest(new rpc.RequestType("client/registerCapability"), () => {});

    OnNotification("textDocument/publishDiagnostics",connection)
    
    await connection.sendNotification(new rpc.NotificationType("initialized"), {});
    state.connection = connection
    return connection
}

async function stopListening(id){
    listeners.pop()
}    


async function OnNotification(notificationType,connection){
    try{
        connection.onNotification(notificationType, (res) => {
          try {
            handlerForNotifcation(res)
          } catch(e) {
            console.log(e);
          }
        });
    }
    catch(err){
        throw new Error("unable to handle notification "+notificationType+ ": Error"+err)
    }
}

async function handlerForNotifcation(res){
    for(var i=0;i<listeners.length;i++){
        listeners[i].listener(res,listeners[i].expectedDiagnostics)
        if(await listeners[i].verifyIfDone())
        {
            listeners[i].done()
            stopListening(listeners[i].id)            
        }
    }
}

function registerForNotification(listener,expectedDiagnostics,verifyIfDone,done){
    var id = listenerId
    listeners.push({id:listenerId, listener:listener, expectedDiagnostics:expectedDiagnostics,verifyIfDone:verifyIfDone,done:done})
    listenerId++
    return id
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
