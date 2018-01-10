"use strict";

const rpc = require('vscode-jsonrpc');
const uri = require('vscode-uri').default;

async function request(fileUri, connection,requestType,position,options) {
  var messageParams = {}
  if(position){
    messageParams.position = {
      "line": parseInt(position.lineNumber),
      "character": parseInt(position.characterNumber)
    }
  }

  if(options)
    messageParams.options = options
  
  messageParams.textDocument = { 
    "uri": uri.file(fileUri).toString().replace('%25','%')
  };
  var request = new rpc.RequestType(requestType)

  return await connection.sendRequest(request, messageParams, null);
}

module.exports = {
  request:request
};  