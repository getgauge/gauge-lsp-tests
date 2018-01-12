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
  setTimeout(function() {}, 500);
 
  return await connection.sendRequest(new rpc.RequestType(requestType), messageParams, null);
}

async function sendRequest(connection,method,params,token){
  setTimeout(function() {}, 500);

  if(token)
    await connection.sendRequest(new rpc.RequestType(method), params,token);
  else    
    await connection.sendRequest(new rpc.RequestType(method), params);
}

function onRequest(connection,method,params){
  connection.onRequest(new rpc.RequestType(method), params);
}

module.exports = {
  request:request,
  sendRequest:sendRequest,
  onRequest:onRequest
};