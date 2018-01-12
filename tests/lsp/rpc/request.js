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

  console.log("request sent "+requestType+" params ")  
 
  return await connection.sendRequest(new rpc.RequestType(requestType), messageParams, null);
}

async function sendRequest(connection,method,params,token){
  if(token)
    await connection.sendRequest(new rpc.RequestType(method), params,token);
  else    
    await connection.sendRequest(new rpc.RequestType(method), params);
  
    console.log("request sent "+method+" params ")  
}

function onRequest(connection,method,params){
  connection.onRequest(new rpc.RequestType(method), params);
}

module.exports = {
  request:request,
  sendRequest:sendRequest,
  onRequest:onRequest
};