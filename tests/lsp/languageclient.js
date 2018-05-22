"use strict";
const vscodeUri = require('vscode-uri').default;
const file = require('../util/fileExtension');

const _lspServer = require('./gauge');
var path = require('path');
var fs = require('fs');
var assert = require('assert');
const { spawn, execSync } = require('child_process');
const _request = require('./rpc/request');
const _notification = require('./rpc/notfication');
const _connection = require('./rpc/connection');
var cwd = process.cwd();
var state = {}
var listeners = [];
var listenerId = 0;

async function shutDown() {
    await _request.sendRequest(state.connection, "shutdown", undefined)
    _notification.sendNotification(state.connection, "exit");
}

function getRange(position){
    return {
        "line": parseInt(position.line),
        "character": parseInt(position.character)        
    }
}

function getMessageParams(fileUri,keyValues) {
    if(keyValues==null)
        return null
    var messageParams = {}
    for (var index = 0; index < Object.keys(keyValues).length; ++index) {
        messageParams[Object.keys(keyValues)[index]] = (keyValues[Object.keys(keyValues)[index]]);
    }

    messageParams.textDocument = {
        "uri": vscodeUri.file(fileUri).toString().replace('%25','%')
    };

    return messageParams;
}

async function codeAction(fileUri,range,diagnostics) {
    return _request.sendRequest(state.connection,'textDocument/codeAction',getMessageParams(filePath(fileUri),
        {"range":range,"context":{"diagnostics":diagnostics}}
    ));
}

async function codeLens(fileUri) {
    return _request.sendRequest(state.connection, 'textDocument/codeLens',getMessageParams(filePath(fileUri),{}))
}

async function codecomplete(position, relativeFilePath) {
    return _request.sendRequest(state.connection, 'textDocument/completion',getMessageParams(filePath(relativeFilePath),{"position":getRange(position)}))
}

async function gotoDefinition(position, relativeFilePath) {
    return _request.sendRequest(state.connection, 'textDocument/definition',getMessageParams(filePath(relativeFilePath),{"position":getRange(position)}))
}

async function workspaceSymbol(params) {
    return _request.sendRequest(state.connection, 'workspace/symbol', params)
}

async function documentSymbol(relativeFilePath) {
    return _request.sendRequest(state.connection, 'textDocument/documentSymbol',getMessageParams(filePath(relativeFilePath),{}))
}

async function formatFile(relativeFilePath) {
    return _request.sendRequest(state.connection, 'textDocument/formatting',getMessageParams(filePath(relativeFilePath),{"options":{
        "tabSize": 4,
        "insertSpaces": true
    }}))
}

function filePath(relativePath) {
    return path.join(projectPath(), relativePath);
}

function projectPath() {
    if (!state.projectPath)
        throw ("Project path not set");
    return state.projectPath;
}

function prerequisite(projectPath, runner) {
    file.copyFile(path.join("data", "manifest/manifest-" + runner + ".json"), path.join(projectPath, "manifest.json"))
    state.projectPath = file.getFSPath(path.join(cwd,projectPath));

    if (runner == "ruby") {
        var output = execSync('gauge version -m');
        var version = JSON.parse(output.toString()).plugins.find(p => p.name == "ruby").version;
        var gemFilePath = file.getFSPath(path.join(state.projectPath, "Gemfile"));
        var fileContent = file.parseContent(gemFilePath);
        var result = fileContent.replace(/\${ruby-version}/, version);
        file.write(gemFilePath, result);
        var vendorFolderPath = path.join(process.cwd(), "data", "vendor");
        execSync('bundle install --path ' + vendorFolderPath, { encoding: 'utf8', cwd: file.getFSPath(state.projectPath) });
    }
}

async function refactor(uri, position, newName) {
    return _request.sendRequest(state.connection, "textDocument/rename", {
        "textDocument": { "uri": file.getUri(filePath(uri)) },
        "position": getRange(position),
        "newName": newName
    })
}

async function openProject(projectPath, isTestData) {
    state.gaugeDaemon = await _lspServer.startLSP(state.projectPath);
    return initialize(state.gaugeDaemon, state.projectPath)
};

function verificationFailures() {
    var errorMessage = state.logger.getErrorMessage()
    return errorMessage
}

async function sendRequest(method, params) {
    return _request.sendRequest(state.connection, method, params)
}


function saveFile(relativePath, version) {
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
            "contentChanges": [{
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

    var expectedCapabilityIds = ["gauge-fileWatcher", "gauge-runner-didOpen", "gauge-runner-didClose", "gauge-runner-didChange", "gauge-runner-didChange", "gauge-runner-fileWatcher"];
    var registerCapabilityPromise = new Promise(async function (resolve, reject) {
        if (process.env.lsp_supported) {
            _request.onRequest(connection, "client/registerCapability", async (data) => {
                data.registrations.forEach(registration => {
                    expectedCapabilityIds = expectedCapabilityIds.filter(id => registration.id !== id);
                });
                if (expectedCapabilityIds.length == 0) {
                    resolve()
                }
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
    editFile: editFile,
    saveFile: saveFile,
    codeAction:codeAction,
    codeLens: codeLens,
    codecomplete: codecomplete,
    gotoDefinition: gotoDefinition,
    formatFile: formatFile,
    filePath: filePath,
    projectPath: projectPath,
    verificationFailures: verificationFailures,
    prerequisite: prerequisite,
    refactor: refactor,
    sendRequest: sendRequest,
    documentSymbol: documentSymbol,
    workspaceSymbol: workspaceSymbol
}
