"use strict";

const { spawn } = require('child_process');
var path = require('path');
var languageClient = require('./languageclient')
var file = require('../util/fileExtension')
var state = {}

async function startGaugeDaemonWithLanguage(relativePath,listener,expectedDiagnostics,verifyIfDone,done){
    var property = process.env.language;
    file.copyFile(path.join("testdata","manifest-"+property+".json"),path.join(relativePath,"manifest.json"))
    await startGaugeDaemon(relativePath,listener,expectedDiagnostics,verifyIfDone,done)
}

async function startGaugeDaemon(projectPath,listener,expectedDiagnostics,verifyIfDone,done) {    
    state.projectPath = file.getFullPath(projectPath);

    var use_working_directory = process.env.use_working_directory;
    var args = (use_working_directory) ? ['daemon', '--lsp', "--dir="+state.projectPath ,"-l", "debug"] : ['daemon', '--lsp', "-l", "debug"];

    state.gaugeDaemon = spawn('gauge', args,{cwd:state.projectPath});
    state.connection = await languageClient.initialize(state.gaugeDaemon,state.projectPath,listener,expectedDiagnostics,verifyIfDone,done)
};

function connection() {
    if (!state.gaugeDaemon)
        throw ("Gauge Daemon not initialized");
    if (!state.connection)
        throw ("Gauge Daemon connection not available")
    return state.connection;
}

async function stopGaugeDaemon(done){
    languageClient.shutDown()
}

function filePath(relativePath){
    return path.join(projectPath() , relativePath);
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
    projectPath: projectPath,
    filePath:filePath
};
