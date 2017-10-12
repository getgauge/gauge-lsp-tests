"use strict";

const { spawn } = require("child_process");
const rpc = require("vscode-jsonrpc");
var path = require("path");

var cwd = process.cwd();

var state = {};

async function startGaugeDaemon(projectPath) {
  var absProjectPath = path.join(cwd, projectPath);

  state.gaugeDaemon = spawn("gauge", ["daemon", "--lsp", "--dir=" + absProjectPath]);
  state.reader = new rpc.StreamMessageReader(state.gaugeDaemon.stdout);
  state.writer = new rpc.StreamMessageWriter(state.gaugeDaemon.stdin);

  let connection = rpc.createMessageConnection(state.reader, state.writer);
  connection.listen();
  state.connection = connection;
  state.projectUri = absProjectPath.replace(":", "%3A");
}

function connection() {
  if (!state.gaugeDaemon)
    throw ("Gauge Daemon not initialized");
  if (!state.connection)
    throw ("Gauge Daemon connection not available");
  return state.connection;
}

function projectUri() {
  if (!state.gaugeDaemon)
    throw ("Gauge Daemon not initialized");
  return state.projectUri;
}

function handle(handler, done) {
  if (!state.gaugeDaemon)
    throw ("Gauge Daemon not initialized");
  if (!state.reader)
    throw ("Gauge Daemon Stream reader not available");
  state.reader.listen(async (data) => await handler(data).catch((e) => { done(e); }));
  done();
}

module.exports = {
  startGaugeDaemon: startGaugeDaemon,
  handle: handle,
  connection: connection,
  projectUri: projectUri
};
