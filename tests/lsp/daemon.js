"use strict";

const { spawn } = require('child_process');
var path = require('path');

var languageClient = require('./languageclient')
var file = require('../util/fileExtension')

var state = {}

function registerForNotification(listener,expectedDiagnostics,verifyIfDone,done){
    languageClient.registerForNotification(listener,expectedDiagnostics,verifyIfDone,done)
}

async function startGaugeDaemon(projectPath) {    
    var property = process.env.language;
    file.copyFile(path.join("data","manifest/manifest-"+property+".json"),path.join(projectPath,"manifest.json"))
    state.projectPath = file.getFullPath(projectPath);

    var use_working_directory = process.env.use_working_directory;
    var args = (use_working_directory) ? ['daemon', '--lsp', "--dir="+state.projectPath ,"-l", "debug"] : ['daemon', '--lsp', "-l", "debug"];

    gauge.message("start daemon args "+args)
    state.gaugeDaemon = spawn('gauge', args,{cwd:state.projectPath});
    state.connection = await languageClient.initialize(state.gaugeDaemon,state.projectPath)
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
    registerForNotification:registerForNotification,
    startGaugeDaemon: startGaugeDaemon,
    stopGaugeDaemon:stopGaugeDaemon,
    connection: connection,
    projectPath: projectPath,
    filePath:filePath
};
