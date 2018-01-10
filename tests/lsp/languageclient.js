"use strict";
const rpc = require('vscode-jsonrpc');
const vscodeUri = require('vscode-uri').default;
var state = {}
var listeners = []
var listenerId = 0;

async function shutDown(){
    await state.connection.sendRequest(new rpc.RequestType("shutdown"), undefined)
    state.connection.sendNotification(new rpc.RequestType("exit"));
}

async function initialize(process,execPath,listener,expectedDiagnostics,verifyIfDone,done){
    var reader = new rpc.StreamMessageReader(process.stdout);
    var writer = new rpc.StreamMessageWriter(process.stdin);

    let connection = rpc.createMessageConnection(reader, writer);
    connection = connection;

    connection.listen();

    const initializeParams = getInitializeParams(execPath, process);    
    await connection.sendRequest(new rpc.RequestType("initialize"), initializeParams, null);
    connection.onRequest(new rpc.RequestType("client/registerCapability"), () => {});

    listenerForNotification("textDocument/publishDiagnostics",connection)
    
    if(listener)
        registerOnNotification(listener,expectedDiagnostics,verifyIfDone,done)

    await connection.sendNotification(new rpc.NotificationType("initialized"), {});
    state.connection = connection
    return connection
}

async function stopListening(id){
    listeners.pop()
}    


async function listenerForNotification(notificationType,connection){
    try{
        connection.onNotification(notificationType, (res) => {
          try {
            handlerForDiagnosticResponse(res)
          } catch(e) {
            console.log(e);
          }
        });
    }
    catch(err){
        throw new Error("unable to handle notification "+notificationType+ ": Error"+err)
    }
}

async function handlerForDiagnosticResponse(res){
    for(var i=0;i<listeners.length;i++){
        listeners[i].listener(res,listeners[i].expectedDiagnostics)
        if(await listeners[i].verifyIfDone())
        {
            listeners[i].done()
            stopListening(listeners[i].id)            
        }
    }
}

async function registerOnNotification(listener,expectedDiagnostics,verifyIfDone,done){
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
    getInitializeParams,getInitializeParams,
    shutDown:shutDown
}
