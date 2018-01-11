"use strict";
const vscodeUri = require('vscode-uri').default;
const file = require('../util/fileExtension')
const { spawn } = require('child_process');
var path = require('path');

const _request = require('./rpc/request')
const _notification = require('./rpc/notfication')
const _connection = require('./rpc/connection')

var state = {}
var listeners = [];
var listenerId = 0;

async function shutDown(){
    await _request.sendRequest(state.connection,"shutdown", undefined)
    _notification.sendNotification(state.connection, "exit");
}

async function codeLens(fileUri) {
    return await _request.request(filePath(fileUri),state.connection,'textDocument/codeLens')    
}
  
async function codecomplete(position, relativeFilePath) {
    return await _request.request(filePath(relativeFilePath),state.connection,'textDocument/completion',position)
}
  
async function gotoDefinition(position, relativeFilePath) {
    return await _request.request(filePath(relativeFilePath),state.connection,'textDocument/definition',position)
}
  
async function formatFile(relativeFilePath) {  
    return await _request.request(filePath(relativeFilePath),state.connection,'textDocument/formatting',null,{
        "tabSize":4,
        "insertSpaces":true
    })  
}

function filePath(relativePath){
    return path.join(projectPath() , relativePath);
}

function projectPath() {
    if (!state.gaugeDaemon)
        throw ("Gauge Daemon not initialized");
    return state.projectPath;
}

async function openProject(projectPath) {    
    var property = process.env.language;
    file.copyFile(path.join("data","manifest/manifest-"+property+".json"),path.join(projectPath,"manifest.json"))
    state.projectPath = file.getFullPath(projectPath);

    var use_working_directory = process.env.use_working_directory;
    var args = (use_working_directory) ? ['daemon', '--lsp', "--dir="+state.projectPath ,"-l", "debug"] : ['daemon', '--lsp', "-l", "debug"];

    state.gaugeDaemon = spawn('gauge', args,{cwd:state.projectPath});
    await initialize(state.gaugeDaemon,state.projectPath)
};


async function openFile(relativePath,contentFile) {
    if(contentFile==null)
        contentFile = relativePath
    return await _notification.sendNotification(state.connection,'textDocument/didOpen',
    {
        "textDocument":
        {
            "uri": file.getUri(filePath(relativePath)),
            "languageId": "markdown",
            "version": 1,
            "text": file.parseContent(filePath(contentFile))
        }
    });

    state.connection.onNotification("textDocument/publishDiagnostics", (res) => {});
}  

async function initialize(process,execPath){
    var connection = _connection.newConnection(process)

    const initializeParams = getInitializeParams(execPath, process);    
    
    await _request.sendRequest(connection, "initialize", initializeParams, null);
    _request.onRequest(connection,"client/registerCapability",()=>{})

    await _notification.OnNotification("textDocument/publishDiagnostics",connection,listeners)    
    await _notification.sendNotification(connection, "initialized",{})
    state.connection = connection
    return connection
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
    openProject:openProject,
    registerForNotification:registerForNotification,
    shutDown:shutDown,
    openFile:openFile,
    codeLens:codeLens,
    codecomplete:codecomplete,
    gotoDefinition:gotoDefinition,
    formatFile:formatFile,
    filePath:filePath,
    projectPath:projectPath
}
