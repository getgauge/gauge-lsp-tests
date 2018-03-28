"use strict";
const vscodeUri = require('vscode-uri').default;
const file = require('../util/fileExtension')

const { spawn, execSync } = require('child_process');
var path = require('path');
var fs = require('fs');
var assert = require('assert');

const _request = require('./rpc/request')
const _notification = require('./rpc/notfication')
const _connection = require('./rpc/connection')

var state = {}
var listeners = [];
var listenerId = 0;

async function shutDown() {
    await _request.sendRequest(state.connection, "shutdown", undefined)
    _notification.sendNotification(state.connection, "exit");
}

async function codeLens(fileUri) {
    return _request.request(filePath(fileUri), state.connection, 'textDocument/codeLens')
}

async function codecomplete(position, relativeFilePath) {
    return _request.request(filePath(relativeFilePath), state.connection, 'textDocument/completion', position)
}

async function gotoDefinition(position, relativeFilePath) {
    return _request.request(filePath(relativeFilePath), state.connection, 'textDocument/definition', position)
}

async function formatFile(relativeFilePath) {
    return _request.request(filePath(relativeFilePath), state.connection, 'textDocument/formatting', null, {
        "tabSize": 4,
        "insertSpaces": true
    })
}

async function getImplFiles() {
    return _request.sendRequest(state.connection, "gauge/getImplFiles", {});
}

function filePath(relativePath) {
    return path.join(projectPath(), relativePath);
}

function projectPath() {
    if (!state.gaugeDaemon)
        throw ("Gauge Daemon not initialized");
    return state.projectPath;
}

function prerequisite(projectPath, language) {
    if (language == "ruby") {
        execSync('bundle install', {encoding: 'utf8', cwd: file.getFullPath(projectPath) })
    }
}

async function refactor(uri,position,newName){
    return _request.sendRequest(state.connection, "textDocument/rename",{
        "textDocument":{"uri": file.getUri(filePath(uri))},
        "position":position,
        "newName":newName
    })
}

async function openProject(projectPath, runner, isTestData) {
    state.projectPath = (isTestData) ? projectPath : file.getFullPath(projectPath);
    var use_working_directory = process.env.use_working_directory;
    var args = (use_working_directory) ? ['daemon', '--lsp', "--dir=" + state.projectPath] : ['daemon', '--lsp'];
    if (!isTestData) {
        var language = (runner == null) ? "nolang" : runner;
        file.copyFile(path.join("data", "manifest/manifest-" + language + ".json"), path.join(projectPath, "manifest.json"))
    }

    var args = (process.env.use_working_directory) ? ['daemon', '--lsp', "--dir=" + state.projectPath, "-l", "debug"] : ['daemon', '--lsp', "-l", "debug"];

    state.gaugeDaemon = spawn('gauge', args, { cwd: state.projectPath });
    return initialize(state.gaugeDaemon, state.projectPath)
};

function verificationFailures() {
    var errorMessage = state.logger.getErrorMessage()
    return errorMessage
}

async function gaugeSpecs() {
    return _request.sendRequest(state.connection, 'gauge/specs', {})
}

async function gaugeScenarios(spec) {
    return _request.sendRequest(state.connection, 'gauge/scenarios', {
        "textDocument": {
            "uri": filePath(spec),
            "position": {
                "line": 1,
                "character": 1
            }
        }
    })
}

function saveFile(relativePath,version) {
    _notification.sendNotification(state.connection, 'textDocument/didSave',
        {
            "textDocument":
                {
                    "uri": file.getUri(filePath(relativePath))
                }
        });
}


function editFile(relativePath, contentFile) {
    if (contentFile == null)
        contentFile = relativePath
    
    state.connection.onNotification("textDocument/publishDiagnostics", (res) => { });
    
    _notification.sendNotification(state.connection, 'textDocument/didChange',
        {
            "textDocument":
                {
                    "uri": file.getUri(filePath(relativePath))
                },
            "contentChanges":[{
                "text": file.parseContent(filePath(contentFile)),
            }]
        });
}

function openFile(relativePath, contentFile) {
    if (contentFile == null)
        contentFile = relativePath
    
    state.connection.onNotification("textDocument/publishDiagnostics", (res) => { });
    _notification.sendNotification(state.connection, 'textDocument/didOpen',
        {
            "textDocument":
                {
                    "uri": file.getUri(filePath(relativePath)),
                    "languageId": "markdown",
                    "version": 1,
                    "text": file.parseContent(filePath(contentFile))
                }
        });
}

async function initialize(gaugeProcess, execPath) {
    var result = _connection.newConnection(gaugeProcess)
    var connection = result.connection
    state.logger = result.logger

    const initializeParams = getInitializeParams(execPath, gaugeProcess);

    connection.onNotification("window/logMessage", (message) => {
        console.log(JSON.stringify(message))
    });

    connection.onError((e) => {
        console.log(JSON.stringify(message));
    });

    await _request.sendRequest(connection, "initialize", initializeParams, null)
    _notification.sendNotification(connection, "initialized", {})

    var registerCapabilityPromise = new Promise(async function (resolve, reject) {
        if (process.env.lsp_supported) {
            _request.onRequest(connection, "client/registerCapability", async () => {
                resolve()
            })
        } else {
            resolve()
        }
    });

    if (listeners != null && listeners.length > 0)
        _notification.OnNotification("textDocument/publishDiagnostics", connection, listeners)

    state.connection = connection
    return registerCapabilityPromise
}

// Return the parameters used to initialize a client - you may want to extend capabilities
function getInitializeParams(projectPath, process) {
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
                executeCommand: { dynamicRegistration: true }
            },
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

function registerForNotification(listener, expectedDiagnostics, verifyIfDone, done) {
    var id = listenerId
    listeners.push({ id: listenerId, listener: listener, expectedDiagnostics: expectedDiagnostics, verifyIfDone: verifyIfDone, done: done })
    listenerId++
    return id
}

module.exports = {
    openProject: openProject,
    registerForNotification: registerForNotification,
    shutDown: shutDown,
    openFile: openFile,
    editFile:editFile,
    saveFile:saveFile,
    codeLens: codeLens,
    codecomplete: codecomplete,
    gotoDefinition: gotoDefinition,
    formatFile: formatFile,
    filePath: filePath,
    projectPath: projectPath,
    verificationFailures: verificationFailures,
    gaugeSpecs: gaugeSpecs,
    gaugeScenarios: gaugeScenarios,
    prerequisite: prerequisite,
    refactor:refactor,
    getImplFiles:getImplFiles
}
