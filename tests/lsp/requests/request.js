"use strict";

const rpc = require('vscode-jsonrpc');

async function autocomplete(position,store,responseHandler){
    var fileUri = store.get("fileUri");
      
      var messageParams = 
      {"textDocument":
        {"uri":"file:///"+fileUri},
        "position":
        {
          "line":parseInt(position.lineNumber),
          "character":parseInt(position.characterNumber)
        }
      };
      var request = new rpc.RequestType('textDocument/completion')
      var reader = store.get("reader");
      reader.listen(responseHandler);
    
      var connection = store.get("connection");
      connection.sendRequest(request, messageParams,null);    
  }

module.exports = {autocomplete:autocomplete};  