"use strict";

const rpc = require('vscode-jsonrpc');

async function openFile(file,store,responseHandler){
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
    if(responseHandler){
      var reader = store.get("reader");
      reader.listen(responseHandler);
    }
  }
  
module.exports = {openFile:openFile};    