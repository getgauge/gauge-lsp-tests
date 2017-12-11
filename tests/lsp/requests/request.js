"use strict";

const rpc = require('vscode-jsonrpc');
const uri = require('vscode-uri').default;

async function codeLens(fileUri, connection) {
  request(null,fileUri,connection,'textDocument/codeLens')
}

async function codecomplete(position, fileUri, connection) {
  request(position,fileUri,connection,'textDocument/completion')
}

async function autocomplete(position, fileUri, connection) {
  request(position,fileUri,connection,'textDocument/completion')
}

async function request(position, fileUri, connection,requestType) {
  var messageParams = {}
  if(position){
    messageParams.position = {
      "line": parseInt(position.lineNumber),
      "character": parseInt(position.characterNumber)
    }
  }
  messageParams.textDocument = { "uri": uri.file(fileUri).toString() };
  var request = new rpc.RequestType(requestType)

  connection.sendRequest(request, messageParams, null);
}

async function gotoDefinition(position, fileUri, connection) {
  request(position,fileUri,connection,'textDocument/definition')
}

module.exports = {
  autocomplete: autocomplete,
  codecomplete: codecomplete,
  gotoDefinition:gotoDefinition,
  codeLens:codeLens
};  