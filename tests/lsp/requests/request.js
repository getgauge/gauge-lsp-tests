"use strict";

const rpc = require('vscode-jsonrpc');

async function autocomplete(position, fileUri, connection) {
  request(position,fileUri,connection,'textDocument/completion')
}

async function request(position, fileUri, connection,requestType) {
  var messageParams =
    {
      "textDocument":
      { "uri": "file:///" + fileUri },
      "position":
      {
        "line": parseInt(position.lineNumber),
        "character": parseInt(position.characterNumber)
      }
    };
  var request = new rpc.RequestType(requestType)

  connection.sendRequest(request, messageParams, null);
}

async function goto_definition(position, fileUri, connection) {
  request(position,fileUri,connection,'textDocument/definition')
}

module.exports = {
  autocomplete: autocomplete,
  goto_definition:goto_definition
};  