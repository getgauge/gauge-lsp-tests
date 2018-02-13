"use strict";
const vscodeUri = require('vscode-uri').default;
const file = require('../util/fileExtension')

const { spawn, exec } = require('child_process');
var path = require('path');
var fs = require('fs');
var assert = require('assert');

const _request = require('./rpc/request')
const _notification = require('./rpc/notfication')
const _connection = require('./rpc/connection')

var state = {}
var listeners = [];
var listenerId = 0;

async function shutDown(){
    _request.sendRequest(state.connection,"shutdown", undefined)
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

async function prerequisite(projectPath,language){
    if (language == "ruby") {
        var filePath = state.projectPath+path.sep+"Gemfile"
        var command = 'bundle install --gemfile='+ filePath

        var execPromise = new Promise(async function (resolve, reject) {
            if (fs.existsSync(filePath)) {
                exec(command).on("exit", (c, d) => {
                    resolve()
                })

            } else {
                resolve()
            }   
        })

        await execPromise 
    }
}

async function openProject(projectPath,runner,isTestData) {      
    state.projectPath = (isTestData)? projectPath:file.getFullPath(projectPath)

    var use_working_directory = process.env.use_working_directory;        
    var args = (use_working_directory) ? ['daemon', '--lsp', "--dir="+state.projectPath ,"-l", "debug"] : ['daemon', '--lsp', "-l", "debug"];
    if(!isTestData)
    {
        var language = (runner==null)?"nolang":runner;
        file.copyFile(path.join("data","manifest/manifest-"+language+".json"),path.join(projectPath,"manifest.json"))            
    }

    var args = (process.env.use_working_directory) ? ['daemon', '--lsp', "--dir="+state.projectPath ,"-l", "debug"] : ['daemon', '--lsp', "-l", "debug"];

    var daemon = spawn('gauge', args,{cwd:state.projectPath});
    daemon.stdout.on('data', (data) => {
        gauge.message(`stdout: ${data}`);
    });

    daemon.stderr.on('data', (data) => {
        gauge.message(`stderr: ${data}`);
        console.error(`stderr: ${data}`);
    });

    daemon.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
    state.gaugeDaemon = daemon;
    await initialize(state.gaugeDaemon, state.projectPath)
};

function verificationFailures(){
    var errorMessage = state.logger.getErrorMessage()
    return errorMessage
}

async function gaugeSpecs(){
    return await _request.sendRequest(state.connection,'gauge/specs',{})
}

async function gaugeScenarios(spec){
    return await _request.sendRequest(state.connection,'gauge/scenarios',{
        "textDocument":{
            "uri":filePath(spec),
            "position":{
                "line":1,
                "character":1
            }
        }
    })
}

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

async function initialize(gaugeProcess,execPath){
    var result = _connection.newConnection(gaugeProcess)
    var connection = result.connection
    state.logger = result.logger

    const initializeParams = getInitializeParams(execPath, gaugeProcess);

    connection.onNotification("window/logMessage",(message) => {
        console.log(JSON.stringify(message))
    });
    
    await _request.sendRequest(connection, "initialize", initializeParams, null)    
    _notification.sendNotification(connection, "initialized",{})
    
    var registerCapabilityPromise = new Promise(async function (resolve, reject) {
        if (process.env.lsp_supported) {
            _request.onRequest(connection, "client/registerCapability", async () => {
                resolve()
            })
        } else {
            resolve()
        }
    });

    if(listeners!=null && listeners.length>0)
        _notification.OnNotification("textDocument/publishDiagnostics",connection,listeners)

    state.connection = connection
    return registerCapabilityPromise
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
    projectPath:projectPath,
    verificationFailures:verificationFailures,
    gaugeSpecs:gaugeSpecs,
    gaugeScenarios:gaugeScenarios,
    prerequisite:prerequisite
}
