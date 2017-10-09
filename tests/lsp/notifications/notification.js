"use strict";

const rpc = require('vscode-jsonrpc');

async function openFile(file,store){
    var uri = store.get('projectUri')
    var fileUri = uri+file.path;
  
    var notification = new rpc.NotificationType('textDocument/didOpen')
    var connection = store.get("connection");
    store.put("fileUri", fileUri);
  
    connection.sendNotification(notification, 
      {"textDocument":
        {"uri":"file:///"+fileUri,
        "languageId":"markdown",
        "version":1,
        "text":file.content}});
  }
  
module.exports = {openFile:openFile};    