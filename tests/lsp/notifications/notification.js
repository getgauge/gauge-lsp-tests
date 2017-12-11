"use strict";

const rpc = require('vscode-jsonrpc');
var path = require('path')
const uri = require('vscode-uri').default;

async function openFile(file, connection, projectPathEncoded) {
  var fileUri = path.join(projectPathEncoded , file.path);

  var notification = new rpc.NotificationType('textDocument/didOpen')

  return await connection.sendNotification(notification,
    {
      "textDocument":
      {
        "uri": uri.file(fileUri).toString().replace('%25','%'),
        "languageId": "markdown",
        "version": 1,
        "text": file.content
      }
    });
}

module.exports = { openFile: openFile };