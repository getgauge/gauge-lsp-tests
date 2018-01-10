"use strict";

const rpc = require('vscode-jsonrpc');
var path = require('path')
const file = require('../util/fileExtension')

async function openFile(filePath,content, connection) {
  var notification = new rpc.NotificationType('textDocument/didOpen')

  return await connection.sendNotification(notification,
    {
      "textDocument":
      {
        "uri": file.getUri(filePath),
        "languageId": "markdown",
        "version": 1,
        "text": content
      }
    });
}

module.exports = { openFile: openFile };