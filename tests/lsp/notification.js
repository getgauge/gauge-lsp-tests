"use strict";

const rpc = require('vscode-jsonrpc');
var path = require('path')
const uri = require('vscode-uri').default;

async function openFile(file, connection, projectPath,handler) {
  var fileUri = path.join(projectPath , file.path);

  var notification = new rpc.NotificationType('textDocument/didOpen')

  if(handler!=null)
    connection.onNotification(notification,handler)    

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