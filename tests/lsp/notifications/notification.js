"use strict";

const rpc = require('vscode-jsonrpc');
var path = require('path')

async function openFile(file, connection, projectUri) {
  var fileUri = path.join(projectUri , file.path);

  var notification = new rpc.NotificationType('textDocument/didOpen')

  return await connection.sendNotification(notification,
    {
      "textDocument":
      {
        "uri": "file:///" + fileUri,
        "languageId": "markdown",
        "version": 1,
        "text": file.content
      }
    });
}

module.exports = { openFile: openFile };