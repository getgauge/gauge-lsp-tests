"use strict";

const rpc = require('vscode-jsonrpc');

async function autocomplete(position, fileUri, connection) {
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
  var request = new rpc.RequestType('textDocument/completion')

  connection.sendRequest(request, messageParams, null);
}

module.exports = {
  autocomplete: autocomplete,
};  