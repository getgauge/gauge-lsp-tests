"use strict";

const rpc = require("vscode-jsonrpc");

async function openFile(file, connection, projectUri) {
  var fileUri = projectUri + file.path;

  var notification = new rpc.NotificationType("textDocument/didOpen");

  connection.sendNotification(notification,
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